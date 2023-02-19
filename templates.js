exports.bookTemplate = `---
{{#duration}}duration: {{duration}}{{/duration}}
topics: {{&topics}}
publishers: {{&publishers}}
issued: {{issued}}
{{#pages}}pages: {{pages}}{{/pages}}
isbn: {{isbn}}
---
# [{{title}}]({{&url}})
By {{&author}}

![]({{{coverUrl}}})

{{&description}}

{{#quotes}}
### {{date}} {{chapter}}
{{&quote}}

{{/quotes}}
`;
