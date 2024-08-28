
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <i key={`full-${i}`} className="fas fa-star" />
        ))}
      {halfStar && <i className="fas fa-star-half-alt" />}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <i key={`empty-${i}`} className="far fa-star" />
        ))}
    </div>
  );
};

export default StarRating;
