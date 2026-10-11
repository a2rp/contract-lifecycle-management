![Pactline contract operations workspace](screenshot.png)

# Pactline | Contract lifecycle management

Pactline is a frontend-only contract operations workspace for keeping agreement details, review decisions, renewal reminders, and team playbooks together. The demo data follows a small business team from the first draft through review, signature, active term, and renewal planning.

**Live app:** [https://a2rp.github.io/contract-lifecycle-management/](https://a2rp.github.io/contract-lifecycle-management/)

## Workspace areas

| Route | What it covers |
| --- | --- |
| `/` | Portfolio overview, agreements by stage, reviews awaiting attention, and nearby notice dates. |
| `/agreements` | Searchable and filterable agreement register, record details, term notes, CSV export, and create/edit/archive/remove actions. |
| `/reviews` | Review queue with an agreement summary, reviewer assignment, approval, and revision requests with notes. |
| `/renewals` | Notice-date timeline with selectable horizons, renewal planning, and a confirmed not-renewing action. |
| `/playbooks` | Reusable agreement starting points, clause previews, template editing, removal, and use-in-draft actions. |

Unknown routes show a branded not-found page. Navigation supports desktop and mobile layouts. The fixed top bar hides while scrolling down and returns while scrolling up. Route changes reset the page scroll position.

## Included behavior

- Create and edit an agreement with a counterparty, agreement type, owner, annual value, effective and end dates, notice date, key-term note, and optional reference filename.
- Validate required fields, nonnegative value, chronological agreement dates, and a notice date that does not come after the term end.
- Inspect each agreement's status, owner, dates, value, key term, and review notes. Mark an agreement awaiting signature as active when a signature is recorded in the demo.
- Search by agreement name, counterparty, ID, owner, or type. Filter by lifecycle status and sort by recent ID, name, or annual value.
- Export the currently filtered register as `pactline-agreements.csv`.
- Archive or remove an agreement through a custom confirmation dialog. Archiving keeps the record available under the Archived filter. Removing it also removes it from the review and renewal views.
- Assign a review to yourself, approve it for signature, or request revisions with a note. Approval moves the agreement to Awaiting signature; revision requests move it to Needs changes and appear in the record notes.
- Review notice dates over 30 days, 90 days, six months, or twelve months. Starting a renewal marks its planning state. Marking a record as not renewing requires confirmation.
- Create, edit, search, filter, and remove playbooks. Preview their example clauses, or use one to prefill a new agreement draft.
- Use toast notifications for saved changes and custom dialogs for confirmation, validation, approvals, and revision notes.
- Download is a real CSV export. Agreement reference files are a frontend preview: the selected filename is kept in the current session record, while file contents are not uploaded or stored.

## Data and boundaries

The app uses realistic sample agreements and playbooks with shared React state for the current browser session. It does not use `localStorage`, `sessionStorage`, IndexedDB, or another browser persistence layer. Refreshing the page restores the sample data and clears session edits.

This preview does not connect to a contract repository, identity provider, e-signature service, email, calendar, or backend. Marking an agreement active is a local status change, not a signature transaction. Notice dates are planning reminders and should be checked against the signed agreement. The clause examples are starting points, not legal advice. Only the filename of a selected reference document is represented in the UI; no document content is transferred or secured.

## Screenshots

Screenshots below show the current app at desktop and mobile widths. The dialog gallery captures every implemented dialog type.

### Pages

<details>
<summary>Overview - desktop portfolio and lifecycle summary</summary>

![Pactline overview with contract portfolio, review queue, renewal notices, and recent activity](screenshot.png)
</details>

<details>
<summary>Agreement register - filters, contract table, and selected record</summary>

![Agreement register with search, lifecycle filters, CSV export, and agreement detail panel](screenshots/pages/agreements.png)
</details>

<details>
<summary>Review room - reviewer queue and agreement terms</summary>

![Review room showing pending agreements, clause summary, reviewer notes, and decision actions](screenshots/pages/reviews.png)
</details>

<details>
<summary>Renewal timeline - selectable notice horizon and renewal actions</summary>

![Renewal planning timeline grouped by notice month](screenshots/pages/renewals.png)
</details>

<details>
<summary>Playbook library - templates, clause preview, and reuse actions</summary>

![Contract playbook library with category filters, template cards, and clause previews](screenshots/pages/playbooks.png)
</details>

<details>
<summary>Not found - branded unknown-route page</summary>

![Pactline branded not-found screen with a link back to the workspace](screenshots/pages/not-found.png)
</details>

<details>
<summary>Mobile overview</summary>

![Mobile overview with stacked summary cards and workspace sections](screenshots/pages/mobile-overview.png)
</details>

<details>
<summary>Mobile agreement register</summary>

![Mobile agreement register with an expandable record detail panel](screenshots/pages/mobile-agreements.png)
</details>

<details>
<summary>Mobile review room</summary>

![Mobile review queue and contract decision actions](screenshots/pages/mobile-reviews.png)
</details>

<details>
<summary>Mobile renewal timeline</summary>

![Mobile renewal timeline cards and notice actions](screenshots/pages/mobile-renewals.png)
</details>

<details>
<summary>Mobile playbook library</summary>

![Mobile playbook cards and template actions](screenshots/pages/mobile-playbooks.png)
</details>

### Dialogs

<details>
<summary>Create agreement - dates, owner, value, key term, and reference filename</summary>

![Create agreement dialog with validated dates and an optional reference filename](screenshots/modals/create-agreement.png)
</details>

<details>
<summary>Edit agreement - prefilled record values</summary>

![Edit agreement dialog with an existing agreement prefilled](screenshots/modals/edit-agreement.png)
</details>

<details>
<summary>Archive agreement - custom confirmation</summary>

![Custom confirmation dialog for archiving an agreement](screenshots/modals/archive-agreement.png)
</details>

<details>
<summary>Remove agreement - custom confirmation</summary>

![Custom confirmation dialog for removing an agreement](screenshots/modals/delete-agreement.png)
</details>

<details>
<summary>Approve review - reviewer note and approval action</summary>

![Review approval dialog with an optional reviewer note](screenshots/modals/approve-review.png)
</details>

<details>
<summary>Request revisions - required reviewer note</summary>

![Revision request dialog with a reviewer note field](screenshots/modals/request-revisions.png)
</details>

<details>
<summary>Mark not renewing - custom confirmation</summary>

![Confirmation dialog for marking an agreement as not renewing](screenshots/modals/mark-not-renewing.png)
</details>

<details>
<summary>Create playbook - name, category, and purpose</summary>

![Playbook creation dialog for a reusable agreement starting point](screenshots/modals/create-playbook.png)
</details>

<details>
<summary>Edit playbook - update team guidance</summary>

![Playbook edit dialog with the selected template prefilled](screenshots/modals/edit-playbook.png)
</details>

<details>
<summary>Remove playbook - custom confirmation</summary>

![Custom confirmation dialog for removing a team playbook](screenshots/modals/delete-playbook.png)
</details>

## Local setup

Use Node.js 20.19 or newer (or 22.12 or newer) and npm.

```bash
npm ci
npm run dev
```

The development server prints the local URL. To check the project:

```bash
npm run lint
npm run build
```

## Deployment

GitHub Pages serves the production app at [https://a2rp.github.io/contract-lifecycle-management/](https://a2rp.github.io/contract-lifecycle-management/). The deploy script runs the Vite build, copies `index.html` to `404.html` for client-side route fallback, then publishes `dist` to the `gh-pages` branch.

```bash
npm run deploy
```

The Vite base path is `/contract-lifecycle-management/`, source maps are disabled, and there is no GitHub Actions deployment workflow.

## Image credit

The locally saved contract-review photo is by [Vitaly Gariev on Unsplash](https://unsplash.com/photos/business-people-signing-a-contract-at-a-table-iPheGw7_UaI), under the Unsplash License. It is used on the overview page and included locally as `public/agreement-review.jpg`.

## Future improvements

These are backend or external-service extensions and are not implemented in this frontend preview:

- Shared server storage, team accounts, and role-based agreement permissions.
- Secure hosted document storage, version history, and searchable full-text documents.
- An e-signature provider integration with verified signing events and completed copies.
- Server-backed audit history and configurable approval policies across teams.
- Calendar and email integrations for renewal notices, reminders, and reviewer assignments.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
