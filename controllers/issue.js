const { Issue, Reply } = require('../models');
const Discussion = require('../models/Discussion')

// Helper function to dynamically populate nested replies
const GetIssues = async (req, res) => {
  const depth = parseInt(req.query.depth) || 10;  // Allow dynamic depth via query params (default to 10)

  const populateReplies = (depth = 10) => {
    let populateQuery = { path: 'replies' };
    let current = populateQuery;

    for (let i = 0; i < depth; i++) {
      current.populate = { path: 'replies' };
      current = current.populate;
    }

    return populateQuery;
  };

  try {
    const issues = await Issue.find()
      .populate(populateReplies(depth))  // Use dynamic depth based on query params
      .exec();
    res.json(issues);
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
};

// const CreateIssue = async (req, res) => {
//   try {
//     let newIssue = await Issue.create(req.body);
//     res.status(201).json(newIssue);  // Return newly created issue with proper status code
//   } catch (err) {
//     console.error('Error creating issue:', err);
//     res.status(400).json({ error: 'Failed to create issue' });
//   }
// };

const CreateIssue = async (req, res) => {
  try {
    const { comment, discussionId } = req.body;

    if (!comment || !discussionId) {
      return res.status(400).json({ error: "Comment and Discussion ID are required" });
    }

    const newIssue = new Issue({
      comment,
      discussionId
    });

    await newIssue.save();

    // Assuming you're also updating the discussion with the new issue
    const discussion = await Discussion.findById(discussionId);
    discussion.issues.push(newIssue._id);
    await discussion.save();

    return res.status(201).json(newIssue);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating issue and updating discussion" });
  }
};

const ReplyToIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { comment, parentReplyId } = req.body;

    // Create a new reply document
    const newReply = new Reply({
      comment,
      issue: issueId,
      parentReply: parentReplyId || null, // If it's a nested reply, set the parentReplyId
    });

    // Save the new reply
    await newReply.save();

    // Update the parent document to add the new reply
    if (parentReplyId) {
      // If this is a nested reply, add it to the parent reply's replies
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

const GetDiscussionIssues = async (req, res) => {
  const { discussionId } = req.params;  // Get discussionId from URL params

  try {
    // Fetch the issues for the specific discussion, along with their replies (up to a certain depth)
    const issues = await Issue.find({ discussionId })
      .populate({
        path: 'replies',
        populate: {
          path: 'replies',
          populate: {
            path: 'replies',  // You can keep nesting this for deeper replies
          },
        },
      })
      .exec();

    if (!issues.length) {
      return res.status(404).json({ message: 'No issues found for this discussion' });
    }

    // Send the populated issues as response
    res.json(issues);
  } catch (err) {
    console.error('Error fetching issues for discussion:', err);
    res.status(500).json({ error: 'Failed to fetch issues and replies' });
  }
};

const ReplyToReply = async (req, res) => {
  try {
    const { id } = req.params;  // Get the issue ID from URL params
    const { comment, parentReplyId } = req.body;  // Get the comment and parentReplyId

    // Find the issue by ID
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).send({ message: 'Issue not found' });

    // Ensure that the replies array is initialized (it should be due to schema)
    if (!issue.replies) {
      issue.replies = [];  // Initialize the replies array if it's not present
    }

    // Create a new reply object
    const newReply = new Reply({
      comment,
      issue: id,
      parentReply: parentReplyId || null,  // If there's a parent reply, include that reference
    });

    // If the reply is a direct reply to the issue, push it directly to the issue's replies
    if (!parentReplyId) {
      issue.replies.push(newReply);
    } else {
      // If it's a nested reply, find the parent reply and add this one to the parent's replies
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
    await newReply.save();
    await issue.save();

    // Return the updated issue with populated replies
    const populatedIssue = await Issue.findById(issue._id).populate('replies');
    res.status(201).json(populatedIssue);  // Send the updated issue with populated replies
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Error adding reply' });
  }
};

module.exports = {
  GetIssues,
  CreateIssue,
  ReplyToReply,
  ReplyToIssue,
  GetDiscussionIssues
};
