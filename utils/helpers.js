module.exports = {
    // helper function to format the date
    format_date: date => {
      return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
        date
      ).getFullYear()}`;
    },

    // Helper function to format singular/plural words
    format_plural: (word, amount) =>{
        if (amount !==1){
            return `${word}s`;
        }
        return word;
    },

    // helper function to format URLs
    format_url: url => {
        return url
        .replace('http://', '')
        .replace('https://', '')
        .replace('www.', '')
        .split('/')[0]
        .split('?')[0];
    }
  }