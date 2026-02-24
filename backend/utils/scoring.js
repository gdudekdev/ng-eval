const calculateScore = (estimatedPrice, realPrice) => {
  const difference = Math.abs(estimatedPrice - realPrice);
  const score = Math.max(0, 100 - difference);
  return Math.round(score * 100) / 100;
};

const calculateLeaderboard = async (session, productModel) => {
  const leaderboard = [];

  for (const participant of session.participants) {
    let totalScore = 0;
    const details = [];

    for (let i = 0; i < session.produits.length; i++) {
      const productId = session.produits[i];
      const estimatedPrice = participant.reponses[i];

      const product = await productModel.getProductById(productId);
      const realPrice = product.prix;

      const score = calculateScore(estimatedPrice, realPrice);
      totalScore += score;

      details.push({
        productId,
        productName: product.nom,
        estimatedPrice,
        realPrice,
        score,
      });
    }

    const averageScore = Math.round((totalScore / session.produits.length) * 100) / 100;

    leaderboard.push({
      utilisateur: participant.utilisateur,
      totalScore,
      averageScore,
      details,
    });
  }

  leaderboard.sort((a, b) => b.totalScore - a.totalScore);

  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return leaderboard;
};

module.exports = {
  calculateScore,
  calculateLeaderboard,
};

