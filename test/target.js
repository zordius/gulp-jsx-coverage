module.exports = {
    multi: (a, b) => {
        return a * b;
    },
    add: (a, b) => {
        return a + b;
    },
    string: function (title, description) {
        return `<div>
 <h1>${title}</h1>
 <p>${description}</p>
</div>`;
    }
}