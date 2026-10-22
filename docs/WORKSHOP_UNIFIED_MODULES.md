# Unified Workshop Modules — Navigation & Routes

## Module 1: VOC, Trial & Inspection

| Item | Value |
|------|--------|
| **Canonical route** | `/app/workshop/inspection` |
| **Workspace** | `/app/workshop/inspection/:caseId` |
| **Pages** | `trial-inspection-dashboard-page.tsx`, `trial-inspection-workspace-page.tsx` (unchanged components) |
| **Backend** | Existing inspection/trial/VOC APIs (no duplicate models) |

### Legacy redirects (no loops)

| Old URL | Redirect |
|---------|----------|
| `/app/workshop/trial-inspection` | `/app/workshop/inspection` |
| `/app/workshop/trial-inspection/:caseId` | `/app/workshop/inspection/:caseId` |
| `/app/workshop/voc` | `/app/workshop/inspection` |
| `/app/workshop/diagnosis` | `/app/workshop/inspection` |

Service-visit stage paths `VOC`, `INSPECTION`, `DIAGNOSIS` → UI segment `inspection`.

## Module 2: Final QC & Road Test

| Item | Value |
|------|--------|
| **Canonical route** | `/app/workshop/qc` |
| **Workspace** | `/app/workshop/qc/:qcCaseId` |
| **Page** | `qc-management-page.tsx` |

### Legacy redirects

| Old URL | Redirect |
|---------|----------|
| `/app/workshop/road-test` | `/app/workshop/qc` |
| `/app/workshop/quality-check` | `/app/workshop/qc` |
| `/app/workshop/quantity-check` | `/app/workshop/qc` |
| `/app/workshop/quantity-verification` | `/app/workshop/qc` |

Stage `ROAD_TEST` → UI segment `qc`.

## Sidebar (Workshop)

1. Booking & Pickup  
2. Vehicle Receiving  
3. VOC, Trial & Inspection  
4. Estimates  
5. Customer Approval  
6. Job Cards  
7. Work in Progress  
8. Final QC & Road Test  
9. Billing & Delivery  

Removed from sidebar (routes may still exist for ops): standalone VOC, Trial, Gate-In queue, Receiving stage queue, Pickup Operations, floor/bay/technician boards (already redirected to WIP).

## Database migrations

None required — navigation and stage path mapping only.
