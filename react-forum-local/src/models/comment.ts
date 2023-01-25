import { Post } from "./post";
import { User } from "./user";

export class Comment {
    constructor(
        public id: number,
        public post_id: number,
        public content: string,
        public user_id: number,
        public user: User,
        public post: Post
    ) {
    }
}