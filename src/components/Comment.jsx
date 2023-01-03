const Comment = ({ setEditId, commentId, text, deleteHandler }) => {
  return (
    <div className='comment-container'>
      <span className='comment'>{text}</span>
      <div className='comment-toolbar-container'>
        <span onClick={() => setEditId(commentId)}>edit</span>
        <span onClick={() => deleteHandler(commentId)}>delete</span>
      </div>
    </div>
  );
};

export default Comment;
