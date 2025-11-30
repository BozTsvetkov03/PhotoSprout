import { Component, OnInit, effect } from '@angular/core';
import { CatalogItem, UserComment } from '../../../../types';
import { User } from '../../../../models/user.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../../../services/catalog.service';
import { AuthService } from '../../../../services/auth.service';
import { LikeService } from '../../../../services/like.service';
import { CommentService } from '../../../../services/comment.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-catalog-item-details',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './catalog-item-details.component.html',
  styleUrl: './catalog-item-details.component.css'
})
export class CatalogItemDetailsComponent implements OnInit {
  item: CatalogItem | null = null;
  isLoading = true;
  error: string | null = null;

  hasLiked = false;
  comments: UserComment[] = [];
  newCommentBody: string = '';

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService,
    private authService: AuthService,
    private likeService: LikeService,
    private commentService: CommentService,
  ) {}

  ngOnInit(): void {
    this.loadItem();

    effect(() => {
      const user = this.authService.user();
      if (user && this.item) {
        this.checkHasLiked(user);
      }
    });
  }

  get currentUser(): User | null {
    return this.authService.user();
  }  

  async loadItem(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid item ID';
      this.isLoading = false;
      return;
    }

    try {
      this.item = await this.catalogService.fetchItemById(id);

      this.commentService.getComments(id).subscribe(comments => {
        this.comments = comments;
      });

      const user = this.authService.user();
      if (user) {
        this.checkHasLiked(user);
      }

    } catch (err) {
      console.error('Error fetching item details', err);
      this.error = 'Failed to load item details';
    } finally {
      this.isLoading = false;
    }
  }

  private async checkHasLiked(user: User): Promise<void> {
    if (!this.item) return;
    try {
      this.hasLiked = await this.likeService.hasUserLiked(this.item.id, user.uid);
    } catch (err) {
      console.error('Failed to check like status', err);
    }
  }

  async submitComment(): Promise<void> {
    const user = this.authService.user();
    if (!this.item || !user) return;

    const body = this.newCommentBody.trim();
    if (!body) return;

    const postId = this.item.id;
    const commentUser = {
      uid: user.uid,
      username: user.username || "Unknown",
      avatar: user.profilePicture || null
    };

    try {
      await this.commentService.addComment(postId, commentUser, body);

      this.newCommentBody = "";

      this.commentService.getComments(postId)
        .subscribe(comments => this.comments = comments);

    } catch (err) {
      console.error("Failed to submit comment:", err);
    }
  }

  get isOwnItem(): boolean {
    const user = this.authService.user();
    return !!user && !!this.item && user.uid === this.item.author.id;
  }

  async onToggleLike(): Promise<void> {
    const user = this.authService.user();
    if (!this.item || !user) return;

    const postId = this.item.id;
    const userId = user.uid;

    this.hasLiked = !this.hasLiked;
    this.item.likeCount = (this.item.likeCount || 0) + (this.hasLiked ? 1 : -1);

    try {
      await this.likeService.toggleLike(postId, userId);
    } catch (err) {
      console.error('Failed to toggle like', err);

      this.hasLiked = !this.hasLiked;
      this.item.likeCount = (this.item.likeCount || 0) + (this.hasLiked ? 1 : -1);
    }
  }
}
