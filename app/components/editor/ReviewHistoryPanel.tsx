import { ReviewHistoryItem } from "@/types/review";

interface Props{
    reviews: ReviewHistoryItem[]
}


export default function ReviewHistoryPanel({reviews,}:Props){
    if (reviews.length===0) return null;
    return(
        <div className="border-t p-4">

      <h2 className="font-bold text-lg mb-4">
        Review History
      </h2>

      <div className="space-y-4">

        {reviews.map(
          (review) => (

            <div
              key={review.id}
              className="border p-4 rounded"
            >

              <div className="text-sm text-gray-500 mb-2">
                {
                  new Date(
                    review.created_at
                  ).toLocaleString()
                }
              </div>

              <div className="whitespace-pre-wrap">
                {review.content}
              </div>

            </div>

          )
        )}

      </div>

    </div>
    )
}