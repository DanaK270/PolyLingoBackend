const express = require('express');
const router = express.Router();
const issueController=require('../controllers/issue')

router.get('/',issueController.GetIssues)
router.post('/',issueController.CreateIssue)
router.post('/:issueId/reply',issueController.ReplyToIssue)
router.delete('/:id/reply',issueController.ReplyToReply)



module.exports=router