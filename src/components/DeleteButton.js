import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { Button, Icon } from 'semantic-ui-react';
import {FETCH_POSTS_QUERY} from '../util/graphql';
import '../App.css';
 
function DeleteButton({ postId, commentId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy){
            setConfirmOpen(false);
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: {
                    getPosts: data.getPosts.filter(p => p.id !== postId)
                }});
            }
            if(callback) callback(); 
        },
        variables: {
            postId,
            commentId
        }
    });
    return(
    
        <>
            {confirmOpen ? (
            <>
            <Button
                as="div" 
                color="green" 
                floated="right" 
                onClick={deletePostOrMutation}
            > 
                <Icon name="check" style={{margin: 0}}/>
            </Button>
            <Button
                as="div" 
                color="yellow" 
                floated="right" 
                onClick={() => setConfirmOpen(false)}
            > 
                <Icon name="cancel" style={{margin: 0}}/>
            </Button>
            </>) : (
                <div className="tooltip">
                <span className="tooltiptext">{commentId ? 'Delete comment' : 'Delete post'}</span>
                <Button
                    as="div" 
                    color="red" 
                    floated="right" 
                    onClick={() => setConfirmOpen(true)}
                > 
                    <Icon name="trash" style={{margin: 0}}/>
                </Button>
                </div>)
            }
        </>
    );
} 

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`
export default DeleteButton; 