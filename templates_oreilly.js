exports.bookTemplate = `---
duration: {{duration}}
publishers: {{publishers}}
issued: {{issued}}
ID: {{id}}
ISBN: {{isbn}}
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
