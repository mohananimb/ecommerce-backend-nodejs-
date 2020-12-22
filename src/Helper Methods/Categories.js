async function generateCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId === null) {
    category = categories.filter((cat) => cat.parentId === undefined);
  } else {
    category = categories.filter(
      (cat) => JSON.stringify(cat.parentId) === JSON.stringify(parentId)
    );
  }

  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      children: await generateCategories(categories, cat._id),
    });
  }

  return categoryList;
}

module.exports = generateCategories;
