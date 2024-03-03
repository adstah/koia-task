//
//
// IMPORTANT: everything starting with "REVIEW:" is part of my review, rest of comments are the original ones
//
//
app.post('/api/extract', upload.single('file'), async (req, res) => {
    // REVIEW: code doesn't seem to be formatted (space) use prettier /w eslint, also please check if those logs are needed (but since these are Info ones, they probably are needed)
    logInfo('POST /api/extract',req.body);
    logInfo('FILE=',req.file);

    // REVIEW: 1. {} is truthy so it might pass this condition, maybe Object.keys(obj).length instead? 2. we could have simply more exact validation, based on some properties that are needed
    // REVIEW-CONTINUE: 3. this 'if' is huge, we could use GUARD CLAUSES instead, so we could have: if(!Object.hasKeys(req.body)) return some_error (and then proceed with rest of the code, so) const file = req.file... etc...
    if (req.body) {
        const file = req.file;
        // REVIEW: we could also destructure it instead of creating everytime a seperate const variable, so const {requestId, project, idUser (or idUser: userID)} = req.body;
        const requestID = req.body.requestID;
        const project = req.body.project;
        const idUser = req.body.userID;
        // REVIEW: not sure where does User come from?
        const user = await User.findOne(idUser);

        // REVIEW: as previously, consider using a guard to avoid huge 'if's and nesting them  too much
        if (requestID && project && idUser && user) {
            // REVIEW: please check if those logs (applies to every logDebug) are needed, as they affect code clarity, app performance and can be messy when somebody works with their own logs
            // REVIEW: formatting
            logDebug('User with role '+user.role, user);
            // REVIEW: we should have roles in some const or enum and then check them with that
            // REVIEW: OPTIONAL - it's a common practice to still have curly brackets {} even if 'if' doesn't technically need them, since it improves readabilty
            // REVIEW: user.role.indexOf('ADVISOR') > -1 seems to be redundant since, there's user.role === 'ADVISOR' check already
            if (user.role === 'ADVISOR' || user.role.indexOf('ADVISOR') > -1)
                return res.json({requestID, step: 999, status: 'DONE', message: 'Nothing to do for ADVISOR role'});

            // REVIEW: since it's one line full length we can have '//'
            /* reset status variables */
            await db.updateStatus(requestID, 1, '');

            logDebug('CONFIG:', config.projects);
            // REVIEW: consider taking the 'incasso' from some const or enum, so it's not hardcoded like that
            if (project === 'inkasso' && config.projects.hasOwnProperty(project) && file) {
                // REVIEW: this seems to be an unused variable
                const hashSum = crypto.createHash('sha256');
                const fileHash = idUser;
                const fileName = 'fullmakt';
                const fileType = mime.getExtension(file.mimetype);
                // REVIEW: it's good to have a type check, but we could have seperate utils/helper for e.g. validations (mentioned in SUMMARY)
                if (fileType !== 'pdf')
                    // REVIEW: (depends on project but) often times there's a error catching/handling, especially when there's 500, so throw new Error(your_error) or similiar might work 
                    return res.status(500).json({requestID, message: 'Missing pdf file'});
                await db.updateStatus(requestID, 3, '');

                const folder = `${project}-signed/${idUser}`;
                logDebug('FILE2=', file);
                // REVIEW: there's a lot of async functions that are not handled in terms of error handling, it's risky and might block this whole functionality. (mentioned later in SUMMARY) (Unless there's some error catcher in app)
                await uploadToGCSExact(folder, fileHash, fileName, fileType, file.mimetype, file.buffer);
                await db.updateStatus(requestID, 4, '');
                const ret = await db.updateUploadedDocs(idUser, requestID, fileName, fileType, file.buffer);
                logDebug('DB UPLOAD:', ret);

                await db.updateStatus(requestID, 5, '');

                // REVIEW: it seems that's an unused variable, can be deleted if no needed
                let sent = true;
                const debtCollectors = await db.getDebtCollectors();
                logDebug('debtCollectors=', debtCollectors);
                // REVIEW: depending on what getDebtCollectors returns: if it might return an empty array, then we should also check/handle debtCollectors.length, but it's hard to tell without knowledge about the app
                // REVIEW-CONTINUE: also in case of an empty array outcome 500 should be replaced with 404 or even 200 since it doesnt have to be en error
                if (!debtCollectors)
                    return res.status(500).json({requestID, message: 'Failed to get debt collectors'});

                // REVIEW: in this 'if' we can check simply if it's falsy without forcing it to be boolean
                // REVIEW: it's a good practice to not leave "FIX" comments for too long like that, remember about it, best would be to fix it now or create a seperate bugfix (in JIRA maybe) for example
                if (!!(await db.hasUserRequestKey(idUser))) { //FIX: check age, not only if there's a request or not
                    return res.json({requestID, step: 999, status: 'DONE', message: 'Emails already sent'});
                }

                const sentStatus = {};
                // REVIEW: maybe we could use const and for... of with destruct? So we dont have to do e.g. debtCollectors[i].id, debtCollectors[i].name, debtCollectors[i].email.
                // REVIEW-CONTINUE: it could look like that for(const [index, {id, name, email}] of debtCollectors.entries())
                // REVIEW-CONTINUE: techinically there's also a potential for optimization when it comes to mail sending, but would need rebuilding the code:
                // REVIEW-CONTINUE: const emailSendingPromises = debtCollectors.map(collector => {/* some logic here */ return email.send(sendConfig, config.projects[project].email.apiKey);}); and then resolving them await Promise.all(emailSendingPromises);
                for (let i = 0; i < debtCollectors.length ; i++) {
                    // REVIEW: formatting
                    await db.updateStatus(requestID, 10+i, '');
                    const idCollector = debtCollectors[i].id;
                    const collectorName = debtCollectors[i].name;
                    const collectorEmail = debtCollectors[i].email;
                    const hashSum = crypto.createHash('sha256');
                    const hashInput = `${idUser}-${idCollector}-${(new Date()).toISOString()}`;
                    logDebug('hashInput=', hashInput);
                    hashSum.update(hashInput);
                    const requestKey = hashSum.digest('hex');
                    logDebug('REQUEST KEY:', requestKey);

                    const hash = Buffer.from(`${idUser}__${idCollector}`, 'utf8').toString('base64')

                    // REVIEW: maybe Promise.all for both, since both are needed at the same time:
                    // REVIEW-CONITNUE: const [correctlySetKey, correctlySetCollector] = Promise.all([db.setUserRequestKey(requestKey, idUser), db.setUserCollectorRequestKey(requestKey, idUser, idCollector)]), then pass them to 'if'
                    if (!!(await db.setUserRequestKey(requestKey, idUser))
                        && !!(await db.setUserCollectorRequestKey(requestKey, idUser, idCollector))) {

                        // REVIEW: '//'
                        /* prepare email */
                        const sendConfig = {
                            // REVIEW: we can declare variable with destruct to hold the nested needed part: const {email: {sender, replyTo, template}} = config.projects[project]
                            sender: config.projects[project].email.sender,
                            replyTo: config.projects[project].email.replyTo,
                            // REVIEW: string wasn't closed
                            subject: 'Email subject,
                            templateId: config.projects[project].email.template.collector,
                            params: {
                                // REVIEW: if there's no predefined const variable for URL, or even taken from env file (and btw it's good to have such a thing)  we can create it here and use it
                                // REVIEW-CONTINUE: const BASE_URL = 'https://url.go/', and second one const endpoint = '?requestKey=${requestKey}&hash=${hash}', so for downloadUrl we would have: `${BASE_URL}download${endpoint}`
                                // REVIEW-CONTINUE: other possibilty (maybe even the preferred one) is to create a util function for creating such and url
                                downloadUrl: `https://url.go/download?requestKey=${requestKey}&hash=${hash}`,
                                uploadUrl: `https://url.go/upload?requestKey=${requestKey}&hash=${hash}`,
                                confirmUrl: `https://url.go/confirm?requestKey=${requestKey}&hash=${hash}`
                            },
                            tags: ['request'],
                            to: [{ email: collectorEmail , name: collectorName }],
                        };
                        logDebug('Send config:', sendConfig);

                        try {
                            await db.setEmailLog({collectorEmail, idCollector, idUser, requestKey})
                        } catch (e) {
                            // REVIEW: since it's error handling we should have logError, and the message itself could be more explanatory
                            logDebug('extract() setEmailLog error=', e);
                        }

                        /* send email */
                        const resp = await email.send(sendConfig, config.projects[project].email.apiKey);
                        logDebug('extract() resp=', resp);

                        // REVIEW: that comment doesn't seem to be helpful, seems to be generic
                        // update DB with result
                        await db.setUserCollectorRequestKeyRes(requestKey, idUser, idCollector, resp);

                        // REVIEW: please check if we want to still have this even if resp is falsy, cause we check resp in the next 'if'
                        if (!sentStatus[collectorName])
                            sentStatus[collectorName] = {};
                        sentStatus[collectorName][collectorEmail] = resp;

                        if (!resp) {
                            logError('extract() Sending email failed: ', resp);
                        }
                    }
                }
                await db.updateStatus(requestID, 100, '');

                logDebug('FINAL SENT STATUS:');
                console.dir(sentStatus, {depth: null});

                // REVIEW: if it's not needed anymore, delete this comment
                //if (!allSent)
                //return res.status(500).json({requestID, message: 'Failed sending email'});

                await db.updateStatus(requestID, 500, '');

                /* prepare summary email */
                const summaryConfig = {
                    // REVIEW: if it's not needed anymore, delete this comment
                    //bcc: [{ email: 'tomas@inkassoregisteret.com', name: 'Tomas' }],
                    sender: config.projects[project].email.sender,
                    replyTo: config.projects[project].email.replyTo,
                    subject: 'Oppsummering Kravsforespørsel',
                    templateId: config.projects[project].email.template.summary,
                    params: {
                        collectors: sentStatus,
                    },
                    tags: ['summary'],
                    // REVIEW: mail could be in a constant variable if it's constant, or from env, same applies to name
                    // REVIEW-CONTINUE: regarding the FIX comment, same rule applies that was mentioned before
                    to: [{ email: 'tomas@upscore.no' , name: 'Tomas' }], // FIXXX: config.projects[project].email.sender
                };
                logDebug('Summary config:', summaryConfig);

                /* send email */
                // REVIEW: left comments, please check if needed and delete if not
                //const respSummary = await email.send(sendConfig, config.projects[project].email.apiKey);
                //logDebug('extract() summary resp=', respSummary);

                await db.updateStatus(requestID, 900, '');
            }
            await db.updateStatus(requestID, 999, '');
            return res.json({requestID, step: 999, status: 'DONE', message: 'Done sending emails...'});
        // REVIEW: regarding 'else': either delete it cause it's not needed, or use guard as mentioned previously, almost at the beginning
        } else
            return res.status(500).json({requestID, message: 'Missing requried input (requestID, project, file)'});
    }
    // REVIEW: return is missing
    res.status(500).json({requestID: '', message: 'Missing requried input (form data)'});
});

// GENERAL SUMMARY
// there are a lot of logs for debugging that might not be needed

// we could consider using Promise.all sometimes

// a lot of async/await are not handled in terms of possible errors, might need try {} catch {}, especially if there's not general error handling in this project

// sometines there's no proper formatting

// unsure, but sometimes operations might need transactional approach, depending on business logic

// this file might be split into/using helpers/utils to avoid having such a huge and complex code. It's to good have for example a  service layer for for example email sending

// there are methods that come from db.method(), so it depends on implemention but it's always good checking possible SQL injections