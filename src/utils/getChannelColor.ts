const getChannelColorClasses = (channel?: string) => {
  switch (channel?.toLowerCase()) {
    case "whatsapp":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "instagram":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
    case "web":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "email":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export default getChannelColorClasses;
