import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
	Button,
	Icon,
	Label,
	Popup
} from "semantic-ui-react";

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

function LikeButton({
	user,
	post: { id, likeCount, likes }
}) {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (
			user &&
			likes.find(like => like.username === user.username)
		) {
			setLiked(true);
		} else setLiked(false);
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id }
	});

	const likeButton = user ? (
		liked ? (
			<Button color="orange" onClick={likePost}>
				<Icon name="heart" />
			</Button>
		) : (
			<Button color="orange" basic onClick={likePost}>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button
			as={Link}
			to="/login"
			color="orange"
			basic
			onClick={likePost}
		>
			<Icon name="heart" />
		</Button>
	);

	return (
		<Popup
			inverted
			content={liked ? "Unlike" : "Like"}
			trigger={
				<Button as="div" labelPosition="right">
					{likeButton}
					<Label
						as="a"
						basic
						color="orange"
						pointing="left"
					>
						{likeCount}
					</Label>
				</Button>
			}
		/>
	);
}

export default LikeButton;
