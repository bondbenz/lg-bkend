function countWord(str, targetWord) {
    const arr = str.split(' ');
    return arr.filter(word => word.toLowerCase() === targetWord.toLowerCase()).length;
}


function mostOccurrentWord(str) {
    let maxOccurence = 0;
    let mostOccurrentWord = '';
    const specialChars = ['\\', '+', '*', '?', '[', '^', ']', '$',
        '(', ')', '{', '}', '=', '!', '<', '>', '|', ':', '-'];
    str.split(' ').forEach(word => {
        if (count = countWord(str, word) > maxOccurence && !specialChars.includes(word) && isNaN(word)) {
            maxOccurence = count;
            mostOccurrentWord = word;
        }
    });
    return mostOccurrentWord;
}


module.exports = {
    mostOccurrentWord
}