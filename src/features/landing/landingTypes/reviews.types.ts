import { Review } from '../../../types';

2; // 1. review submit payload
export interface CreateReviewPayload {
  customerName: string;
  rating: number;
  comment: string;
  userPhone?: string;
}

// 3. API
export interface ReviewSubmitResponse {
  success: boolean;
  message?: string;
}

// 4. ReviewsSection Component Props Interface
export interface ReviewsSectionProps {
  reviews?: Review[];
}
