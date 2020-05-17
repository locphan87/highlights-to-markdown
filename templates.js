exports.bookTemplate = `---
title: {{title}}
bookauthor: {{author}}
date: {{date}}
quotes:
{{#quotes}}
  - date: {{date}}
    quote: {{quote}}
{{/quotes}}
---
{{=<% %>=}}
## *{{page.bookauthor}}*

{% for quote in page.quotes %}
#### {{ quote.date | date: '%B %d, %Y' }}
{{ quote.quote }}
{% endfor %}
<%={{ }}=%>`