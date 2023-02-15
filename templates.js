exports.bookTemplate = `# [{{title}}]({{&url}})
By {{&authors}}

<table>
  <tr>
    <td rowspan="5"><img src="{{{coverUrl}}}" alt="{{title}}" /></td>
    <td><strong>Time To Complete:</strong> {{duration}}</td>
  </tr>
  <tr>
    <td><strong>Published By:</strong> {{publishers}}</td>
  </tr>
  <tr>
    <td><strong>Publication Date:</strong> {{issued}}</td>
  </tr>
  <tr>
    <td><strong>Print Length:</strong> {{pages}}</td>
  </tr>
  <tr>
    <td><strong>ISBN:</strong> {{isbn}}</td>
  </tr>
</table>

{{&description}}

{{#quotes}}
### {{date}} {{chapter}}
{{&quote}}

{{/quotes}}
`;
