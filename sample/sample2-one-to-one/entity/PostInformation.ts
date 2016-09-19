import {GeneratedIdColumn, Column, Table, OneToOne} from "../../../src/index";
import {Post} from "./Post";

@Table("sample2_post_information")
export class PostInformation {

    @GeneratedIdColumn()
    id: number;

    @Column()
    text: string;
    
    @OneToOne(type => Post, post => post.information, {
        cascadeUpdate: true,
    })
    post: Post;

}