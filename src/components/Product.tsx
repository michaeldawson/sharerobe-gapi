export default function Product({ name, price, imageUrl }: any) {
  return (
    <div>
      <h2>{name}</h2>
      {price ? (
        <h3>
          {price.cents / 100} {price.currency}
        </h3>
      ) : null}
      {imageUrl ? (
        <img style={{ maxWidth: 600 }} src={imageUrl} alt="{name}" />
      ) : null}
    </div>
  );
}
