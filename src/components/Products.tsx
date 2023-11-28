import { collection, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import Product from "./Product";

interface Props {
  uid: string;
}

export default function Products({ uid }: Props) {
  const firestore = useFirestore();

  const messages = query(
    collection(firestore, "messages"),
    where("uid", "==", uid),
    where("isFashionPurchase", "==", true)
  );

  const { data = [] } = useFirestoreCollectionData(messages);

  return (
    <div>
      Products
      {data.map((doc) =>
        doc.items?.length ? (
          <div key={doc.message.id}>
            {doc.items?.map((item: any) => (
              <Product
                name={item.name}
                imageUrl={item.imageUrl}
                price={item.price}
              />
            ))}
          </div>
        ) : null
      )}
    </div>
  );
}
