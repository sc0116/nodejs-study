var name1 = 'shin';
var letter = 'Dear ' + name1 + '\n\n\
\
Lorem ipsum dolor sit amet, ' + name1 + ' guis nostrud\
\
comodo';

var letter2 = `Dear  ${name1} 

Lorem ipsum dolor sit amet, 
${name1} guis nostrud comodo
1 + 1 = ${1 + 1}`;
console.log(letter2);