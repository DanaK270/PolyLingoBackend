const express = require('express');
const router = express.Router();
const issueController=require('../controllers/issue')

router.get('/',issueController.GetIssues)
router.post('/',issueController.CreateIssue)
// router.post('/:issueId/reply',issueController.ReplyToIssue)

router.post('/:issueId/replies',issueController.ReplyToIssue)

// router.post('/:lessonId/discussion/:discussionId/issues', issueController.CreateIssue);

// router.delete('/:id/reply',issueController.ReplyToReply)

router.post('/:issueId/replies/:parentReplyId/replies', issueController.ReplyToReply);


// router.get('/discussion/:discussionId/issues', issueController.GetDiscussionIssues);

router.get('/:discussionId/discussion', issueController.GetDiscussionIssues);

router.get('/discussions/:lessonId', issueController.GetDiscussionsByLesson);


module.exports=router