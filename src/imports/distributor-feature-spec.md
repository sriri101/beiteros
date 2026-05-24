Integration: Add as a NEW TAB in Existing Left Sidebar
ROLE

You are a Senior Product Designer & UX Architect specializing in B2B dashboards, inventory systems, and data-heavy UI.

You already know my existing design system:

Color palette (DO NOT introduce new colors)

Typography (DO NOT change fonts or font scale)

Border radius, shadows, spacing system

Table styling

Modal styling

Sidebar layout

Badge styles

Card components

Form field styles

Button hierarchy

Icon style

You must STRICTLY reuse all existing design tokens and components.

Do NOT redesign the app.
Do NOT modernize it.
Do NOT improve styling.
Do NOT introduce new visual identity decisions.

You are ONLY adding a new core feature tab that feels 100% native to the current system.

🎯 OBJECTIVE

Add a new left sidebar tab called:

“Distributors”

This tab contains a complete Distributor → Product → Order management system.

It must feel like it was part of the app from day one.

🧱 SYSTEM ARCHITECTURE OVERVIEW

The new tab includes:

Distributor Directory

Distributor Detail (with editable product table)

Data Import System (3 methods)

Order Builder

Orders Tab (global tracking)

Dashboard Home Widgets

1️⃣ SIDEBAR INTEGRATION

Add new primary navigation item: Distributors

Add new primary navigation item: Orders

Follow existing sidebar spacing, icon alignment, hover style, active state

Do not modify sidebar width or layout

Use existing icon system

2️⃣ DISTRIBUTOR DIRECTORY
Screen: Distributor List View

Layout:

Page title (match existing page header style)

Top right: "+ Add Distributor" primary button

Search bar (reuse existing search component)

Sort dropdown OR clickable column sorting (match current pattern)

Table view (default)

Optional toggle to card view (if consistent with system)

Table Columns:

Distributor Name

Logo (small avatar style)

Contact Info (email + phone stacked)

Products Count

Last Order Date

Status Badge (Active / Inactive)

Actions (View, Edit, Delete)

All columns sortable.
Search filters by distributor name OR product name.

Empty State:

Illustration (reuse system illustration style)

Headline: “No distributors yet”

CTA: Add Distributor

Screen: Add / Edit Distributor Modal

Use existing modal style.

Fields:

Distributor Name (required)

Logo upload

Contact Name

Phone

Email

Notes

Status (Active / Inactive toggle)

Footer:

Cancel

Save

3️⃣ DISTRIBUTOR DETAIL PAGE

When clicking a distributor.

Layout Structure

Top:

Breadcrumb (if system uses it)

Distributor Name (large header)

Status badge

Contact info block

Notes section

Actions:

Edit Distributor

Import Products

Create Order

Below:

Product Table (Spreadsheet Style)

Columns:

| Product Name | SKU | Category | Unit | Pack Size | Unit Price | Case Price | MOQ | In Stock | Notes | Last Updated |

Requirements:

Inline editing (click cell → edit → tab navigation)

Column resizing

Column sorting

Row selection checkboxes

Bulk actions bar appears when rows selected

Auto-save with small “Saving…” indicator

Case Price can auto-calc OR manual override

SKU must be unique per distributor

Bottom of table:

"+ Add Row" button

Row actions:

Duplicate

Delete

4️⃣ DATA ENTRY OPTIONS (ON DISTRIBUTOR PAGE)

Must include 3 methods:

OPTION A — Manual Entry

Inline spreadsheet editing

“+ Add Row” at bottom

Quick Add Modal (form-based entry)

Duplicate row action

Auto-save on field change

Must feel like lightweight Airtable-style editing
BUT using existing table component styling.

OPTION B — Excel / CSV Import

Triggered by:

“Import Products” button

Step 1: Upload Screen

Drag & Drop zone

Browse file button

Accept .xlsx / .csv

Link: Download Template

Step 2: Column Mapping Screen

Two-column layout:

Left:

Detected file headers

Right:

Dropdown: Map to system field

Underneath:

Data preview table (first 3–5 rows)

Auto-detection logic:

Attempt smart matching

Highlight unmapped required fields

Step 3: Validation Screen

Color-coded validation:

Red = Missing required fields / invalid format

Yellow = Duplicates or possible conflicts

Green = Ready

Options:

Update existing (match by SKU)

Add new only

Replace all products for distributor

Primary CTA:

Confirm Import

On confirm:
Data populates product table.

OPTION C — Copy / Paste Mode

Activated via:

“Paste Data” button

UI:

Large paste zone OR grid paste mode

Parse tab-separated values

Show preview

Confirm to add

Must support:
Copying directly from Excel or Google Sheets

5️⃣ ORDER CREATION SYSTEM

Orders originate either from:

Distributor Detail
OR

Global Orders Tab

Order Builder Layout

Left:
Scrollable product table

Columns:

Product Name

SKU

Unit Price

Quantity input

Line Total (auto)

Right:
Sticky Order Summary Card

Contains:

Subtotal

Tax

Shipping

Total

Total Items

Total Cases

Order Note field

Each line item:

Add Note option

Top:

Distributor name

Order status (Draft by default)

Primary CTA:

Submit Order

Quick Order from Scratch

From Orders Tab:

New Order

Step 1:
Select distributor (searchable dropdown)

Step 2:
Load product table

Step 3:
Enter quantities

Step 4:
Review and submit

Reorder

From Order Detail:

Reorder button

Preloads previous quantities.

Order Status Lifecycle

Use existing badge styles.

Statuses:

Draft

Submitted

Confirmed

Shipped

Delivered

Cancelled

Partially Delivered

Must include:
Visual timeline component in Order Detail view.

6️⃣ ORDERS TAB (GLOBAL)

Sidebar item: Orders

Orders List View

Table columns:

Order #

Distributor

Date Created

Status

Total Items

Total Amount

Expected Delivery

Actions

Features:

Sorting

Filtering by status

Date range filter

Distributor filter

Search by Order # or product name

Table/Card toggle (if consistent)

Order Detail Page

Header:

Order #

Distributor

Date

Status badge

Main:

Line items table

Order summary

Status timeline

Activity log

Actions:

Edit (if Draft)

Cancel

Reorder

Export PDF

Print

7️⃣ DASHBOARD HOME WIDGETS

Add these widgets using existing card styles:

Recent Orders (last 5)

Top Distributors (by spend)

Pending Deliveries

Low Stock Alerts

Quick Actions

Widgets must:

Match current dashboard grid system

Use existing card padding & shadows

Be responsive

📱 MOBILE CONSIDERATION

Flag these behaviors:

On Mobile:

Product table becomes stacked card rows

Order builder summary moves below product list

Column mapping becomes vertical stepper

Bulk actions become bottom action bar

Do not redesign mobile layout system.
Adapt within current responsive rules.

🧩 COMPONENT INVENTORY (NEW IF NEEDED)

You may introduce ONLY functional components, styled using existing tokens:

Column Mapping Row

Import Validation Badge

Order Timeline

Bulk Action Toolbar

Sticky Summary Card

Activity Log Feed

File Drop Zone

All must inherit:
Typography
Spacing
Color tokens
Border radius
Shadow system

🗂 DATA MODEL (FOR REFERENCE)

Entities:

Distributor

id

name

contactName

phone

email

logo

notes

status

Product

id

distributorId

name

sku

category

unit

packSize

unitPrice

casePrice

moq

inStock

notes

lastUpdated

Order

id

distributorId

status

createdAt

expectedDate

subtotal

tax

shipping

total

note

OrderLineItem

id

orderId

productId

quantity

unitPrice

lineTotal

note

🚨 EDGE CASES TO DESIGN

No distributors

Distributor with no products

Import file errors

Duplicate SKUs

Order with zero quantity

Order submission failure

Cancelled order restrictions

Partial delivery case

Include:
Loading states
Error banners
Success toasts
Auto-save indicators

📦 DELIVERABLE FORMAT

Produce:

Complete screen list

User flow diagram (textual step flow)

Wireframe-level layout descriptions

Component inventory

Data model structure

Excel import step-by-step flow

Edge case handling

Mobile behavior notes

Do NOT produce high-fidelity visuals.
Do NOT alter brand styling.
Do NOT introduce new design language.

This must feel like a seamless native expansion of my existing dashboard.