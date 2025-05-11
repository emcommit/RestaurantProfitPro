exports.handler = async (event, context) => {
    try {
      // Mock menu data (replace with real data logic as needed)
      const menus = [
        { id: 1, name: "Burger", price: 10 },
        { id: 2, name: "Pizza", price: 12 },
      ];
  
      return {
        statusCode: 200,
        body: JSON.stringify(menus),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch menus" }),
      };
    }
  };