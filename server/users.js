function remove (mem, user) {
  var users = mem.get('users');
  if (users !== 'undefine') {
    console.log(' fuck this ... ');
    var index = users.indexOf(user);
    if (index > -1) {
      users.splice(index, 1);
    }
  }
};

function add (mem, user) {
  users = mem.get('users');
  if (users === 'undefine') {
    users = [];
  }

  users.push(user);
  mem.put('users', users);
};

module.exports = {
  add: add,
  remove: remove
};
