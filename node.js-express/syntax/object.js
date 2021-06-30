var members = ['a', 'b', 'c']
console.log(members[1])
for (i = 0; i < members.length; i++) {
    console.log('array loop: ', members[i])
}

var roles = {
    'programmer': 'a',
    'designer': 'b',
    'manager': 'c'
}
console.log(roles[designer])
for (role in roles) {
    console.log('object loop: ', role, 'value: ', roles[role])
}