const { Issue, Reply } = require('../models');
const Discussion = require('../models/Discussion')

// Helper function to dynamically populate nested replies
const GetIssues = async (req, res) => {
  const depth = parseInt(req.query.depth) || 10; 

  const populateReplies = (depth = 10) => {
    let populateQuery = { path: 'replies' };
    let current = populateQuery;
  
    // Dynamically populate the replies based on the depth parameter
    for (let i = 0; i < depth; i++) {
      current.populate = { path: 'replies' };  // Add next level of replies
      current = current.populate;
    }
  
    return populateQuery;
  };
  

  try {
    const issues = await Issue.find()
      .populate(populateReplies(depth))  // Use dynamic depth
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

// const GetDiscussionIssues = async (req, res) => {
//   const { discussionId } = req.params;  // Get discussionId from URL params

//   try {
//     // Fetch the discussion based on the discussionId
//     const discussion = await Discussion.findById(discussionId);
//     console.log('Fetched discussion:', discussion);

//     if (!discussion) {
//       return res.status(404).json({ message: 'Discussion not found' });
//     }

//     // Fetch issues related to the discussionId
//     const issues = await Issue.find({ discussionId })
//       .populate({
//         path: 'replies',
//         populate: {
//           path: 'replies',
//           populate: {
//             path: 'replies',  // Further nesting if needed
//           },
//         },
//       })
//       .exec();

//     console.log('Fetched issues:', issues);

//     if (!issues || issues.length === 0) {
//       return res.status(404).json({ message: 'No issues found for this discussion' });
//     }

//     // Send the populated issues as response
//     res.json(issues);
//   } catch (err) {
//     console.error('Error fetching issues for discussion:', err);
//     res.status(500).json({ error: 'Failed to fetch issues and replies' });
//   }
// };


const populateReplies = (depth = 10) => {
  let populateQuery = { path: 'replies' };
  let current = populateQuery;

  // Dynamically populate the replies based on the depth parameter
  for (let i = 0; i < depth; i++) {
    current.populate = { path: 'replies' };  // Add next level of replies
    current = current.populate;
  }

  return populateQuery;
};

// Get issues with nested replies for a given discussion
const GetDiscussionIssues = async (req, res) => {
  const { discussionId } = req.params;  // Get discussionId from URL params
  const depth = parseInt(req.query.depth) || 10;  // Get depth from query parameters (default to 10)

  try {
    // Fetch the discussion based on the discussionId
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Fetch issues related to the discussionId and populate replies up to the specified depth
    const issues = await Issue.find({ discussionId })
      .populate(populateReplies(depth))  // Use dynamic depth to populate replies
      .exec();

    if (!issues || issues.length === 0) {
      return res.status(404).json({ message: 'No issues found for this discussion' });
    }

    // Send the populated issues as response
    res.json(issues);
  } catch (err) {
    console.error('Error fetching issues for discussion:', err);
    res.status(500).json({ error: 'Failed to fetch issues and replies' });
  }
};

const GetDiscussionsByLesson = async (req, res) => {
  const { lessonId } = req.params;
  try {
    const discussions = await Discussion.find({ lessonId }); // Ensure this is filtering discussions by lessonId
    res.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
};




const ReplyToReply = async (req, res) => {
  try {
    const { issueId, parentReplyId } = req.params;  // Get the issue ID and parentReply ID from URL params
    const { comment } = req.body;  // Get the comment for the reply

    // Find the issue by ID
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).send({ message: 'Issue not found' });

    // Create a new reply object
    const newReply = new Reply({
      comment,
      issue: issueId,
      parentReply: parentReplyId || null,  // If there's a parent reply, include that reference
    });

    // Ensure the replies array exists on the issue
    if (!issue.replies) {
      issue.replies = [];  // Initialize the replies array if not already present
    }

    // If there is no parentReplyId, it's a direct reply to the issue
    if (!parentReplyId) {
      issue.replies.push(newReply);
    } else {
      // If there is a parent reply, find it by ID and add the new reply as a nested reply
      const parentReply = await Reply.findById(parentReplyId);  // Use findById to get a Mongoose document
      if (parentReply) {
        // Initialize the replies array of the parent reply if it doesn't exist
        if (!parentReply.replies) {
          parentReply.replies = [];
        }

        // Push the new reply to the parent reply's replies array
        parentReply.replies.push(newReply);

        // Save the parent reply
        await parentReply.save();  // Save the updated parent reply
      } else {
        return res.status(404).json({ error: 'Parent reply not found' });
      }
    }

    // Save the new reply
    await newReply.save();

    // Save the issue with the updated replies (this should now include nested replies)
    await issue.save();

    // Populate the replies and send back the updated issue with replies
    const populatedIssue = await Issue.findById(issue._id)
      .populate({
        path: 'replies',
        populate: {
          path: 'replies', // Nested replies inside parent replies
          model: 'Reply',
        },
      });

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
  GetDiscussionIssues,
  GetDiscussionsByLesson
};
