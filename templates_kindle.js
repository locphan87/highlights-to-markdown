exports.bookTemplate = `# {{title}}
By {{&author}}

![{{title}}]({{{coverUrl}}})

{{&description}}

{{#quotes}}
### {{date}}
{{&quote}}

{{/quotes}}
`;
