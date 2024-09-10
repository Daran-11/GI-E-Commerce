import Omise from "omise";

export const omiseServer = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
});

// Client-side Omise initialization (only use the public key)
export const createOmiseToken = async (cardDetails) => {
  // Dynamically import the 'omise' library only on the client-side
  const omiseClient = Omise({
    publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY,
  });

  try {
    const token = await omiseClient.tokens.create({
      card: {
        name: cardDetails.name,
        number: cardDetails.card_number,
        expiration_month: cardDetails.expiration_month,
        expiration_year: cardDetails.expiration_year,
        security_code: cardDetails.security_code,
      },
    });

    if (token.id) {
      return token.id; // Return the token ID
    } else {
      throw new Error("Failed to create token");
    }
  } catch (error) {
    console.error("Omise token creation error:", error);
    throw error;
  }
};
