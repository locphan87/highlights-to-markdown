exports.bookTemplate = `---
title: {{&title}}
bookauthor: {{&author}}
date: {{date}}
position: {{position}}
quotes:
{{#quotes}}
  - date: {{date}}
    quote: {{&quote}}
{{/quotes}}
---
{{=<% %>=}}
## *{{page.bookauthor}}*

{% for quote in page.quotes reversed %}
#### {{ quote.date | date: '%B %d, %Y' }}
{{ quote.quote }}
{% endfor %}
<%={{ }}=%>`;
