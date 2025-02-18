import axios from 'axios';

const API_URL = '';

// Get comments for an evaluation
const getComments = async (evaluationId) => {
  const response = await axios.get(
    `/evaluations/${evaluationId}/comments`
  );

  return response.data;
};

// Create a new comment
const createComment = async (evaluationId, content, parentCommentId = null) => {
  const response = await axios.post(
    `/evaluations/${evaluationId}/comments`,

    { content, parentCommentId }
  );
  return response.data;
};

// Update a comment
const updateComment = async (commentId, content) => {
  const response = await axios.put(
    `/comments/${commentId}`,

    { content }
  );
  return response.data;
};

// Delete a comment
const deleteComment = async (commentId) => {
  await axios.delete(`/comments/${commentId}`);

  return commentId;
};

export default {

  getComments,
  createComment,
  updateComment,
  deleteComment
};
