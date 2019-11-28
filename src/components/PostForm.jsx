import React from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../util/hooks";
import gql from "graphql-tag";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

function PostForm() {
	const { values, onChange, onSubmit } = useForm(
		createPostCallback,
		{
			body: ""
		}
	);

	const [createPost, { error }] = useMutation(
		CREATE_POST_MUTATION,
		{
			variables: values,
			update(proxy, result) {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY
				});
				const new_post = result.data.createPost;
				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: { getPosts: [new_post, ...data.getPosts] }
				});
				values.body = "";
			}
		}
	);

	function createPostCallback() {
		createPost();
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create A Post:</h2>
				<Form.Field>
					<Form.Input
						placeholder="Comment"
						name="body"
						onChange={onChange}
						value={values.body}
						error={error}
					/>
					<Button type="submit" color="orange">
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{marginBottom: 20}}>
					<ul className="list">
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</>
	);
}

export default PostForm;
