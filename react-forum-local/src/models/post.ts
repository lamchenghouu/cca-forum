import { Comment } from "./comment";
import { User } from "./user";

export class Post {
    constructor (
        public id: number,
        public content: string,
        public user_id: number,
        public user: User, 
        public comments: Comment[], 
        public created_at: string,
        public likes: number,
        public tag: string
    ) {

    }

}