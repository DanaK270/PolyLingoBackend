const { Issue, Reply } = require('../models')


const GetIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate({
        path: 'replies',
        populate: {
          path: 'replies',
          populate: { path: 'replies' }, // Adjust as needed for deeper levels
        },
      })
      .exec();
    res.json(issues);
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
};




const CreateIssue = async (req, res) => {
  let newIssue = await Issue.create(req.body);
  res.send(newIssue);
};




const ReplyToIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { comment, parentReplyId } = req.body;

    // Create a new reply document
    const newReply = new Reply({
      comment,
      issue: issueId,
      parentReply: parentReplyId || null, // If it's a nested reply, we set the parentReplyId
    });

    // Save the new reply
    await newReply.save();

    // Update the parent document to add the new reply
    if (parentReplyId) {
      // If this is a nested reply, add the new reply to the parent reply's replies
      await Reply.findByIdAndUpdate(parentReplyId, { $push: { replies: newReply._id } });
    } else {
      // If it's a top-level reply, add it to the issue's replies
      await Issue.findByIdAndUpdate(issueId, { $push: { replies: newReply._id } });
    }

    // Return the newly created reply
    res.status(201).json(newReply);
  } catch (err) {
    console.error('Error adding reply:', err);
    res.status(500).json({ error: 'Failed to add reply' });
  }
};





const ReplyToReply = async (req, res) => {
  try {
    const { id } = req.params;  // Get the issue ID from URL params
    const { issue: replyContent, parentReplyId } = req.body;  // Get the reply content and parentReplyId from the request body, renamed 'issue' to 'replyContent'

    // Find the issue by ID
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).send({ message: 'Issue not found' });

    // Ensure that the replies array is initialized (although it should be due to schema)
    if (!issue.replies) {
      issue.replies = [];  // Initialize the replies array if it's not present
    }

    // Create a new reply object
    const newReply = {
      issue: replyContent,  // Use the renamed 'replyContent' here
      createdAt: new Date(),  // Set the created date as current time
      parentReplyId: parentReplyId || null,  // If there's a parent reply, include that reference
    };

    // If the reply is a direct reply to the issue, push it directly to the issue's replies
    if (!parentReplyId) {
      issue.replies.push(newReply);
    } else {
      // If it's a nested reply, find the parent reply and add this one to the parent's replies array
      const parentReply = issue.replies.find(reply => reply._id.toString() === parentReplyId);
      if (parentReply) {
        if (!parentReply.replies) {
          parentReply.replies = [];  // Initialize parent reply's replies array if needed
        }
        parentReply.replies.push(newReply);
      } else {
        return res.status(404).json({ error: 'Parent reply not found' });
      }
    }

    // Save the issue with the new reply added
    await issue.save();

    // Return the updated issue with populated replies
    const populatedIssue = await Issue.findById(issue._id).populate('replies');
    res.status(201).send(populatedIssue);  // Send the updated issue with populated replies

  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Error adding reply' });
  }
};


module.exports = {
  GetIssues,
  CreateIssue,
  ReplyToReply,
  ReplyToIssue
}