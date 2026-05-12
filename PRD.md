# Product Requirements Document (PRD)
## Gluco-Bridge: Global Diabetes Management Platform

**Version:** 1.0  
**Date:** May 11, 2026  
**Status:** Active Development  
**Last Updated:** May 2026

---

## 1. Executive Summary

**Gluco-Bridge** is a mobile-first, AI-powered health technology platform designed to democratize diabetes management and prevention globally. The product empowers individuals—particularly in resource-limited regions—with accessible tools to monitor, understand, and manage blood glucose levels effectively through intelligent glucose tracking, personalized AI insights, and evidence-based risk assessment.

### Key Value Propositions
- **Accessibility**: Simple, mobile-first interface requiring minimal healthcare infrastructure
- **Intelligence**: AI-powered analysis providing personalized health guidance
- **Accuracy**: OCR-based glucometer scanning for automated glucose value extraction
- **Privacy-First**: GDPR-compliant design with explicit user consent controls
- **Affordability**: Democratized healthcare technology for resource-limited regions

---

## 2. Market & Problem Statement

### Problem
Over **400 million people worldwide** suffer from diabetes, with the majority living in low and middle-income countries where:
- Healthcare access is severely limited
- Glucose monitoring devices are expensive
- Professional medical guidance is unavailable
- Digital health tools are either non-existent or unaffordable
- Risk assessment requires professional intervention

### Target Market
- **Primary**: Individuals in resource-limited regions (low/middle-income countries)
- **Secondary**: Health-conscious individuals interested in preventive care
- **Tertiary**: Community health workers and informal healthcare providers
- **Geographic Focus**: Sub-Saharan Africa, South Asia, Southeast Asia, Latin America

### Market Size
- Global diabetes population: 400M+ people
- Digital health adoption rate in emerging markets: 25-35% (growing)
- TAM: ~100-140M individuals in target regions with digital access

---

## 3. Product Vision & Goals

### Vision
**"Bridging the gap between individuals and healthy living, one glucose reading at a time."**

Empower people everywhere to take control of their health through accessible, intelligent, privacy-respecting diabetes management tools.

### Strategic Goals (12-month)
1. **Functional Excellence**: All core features fully operational and verified
2. **User Acquisition**: 50K active users within 12 months
3. **Accessibility**: Support 5+ languages; WCAG 2.1 AA compliance
4. **Trust & Safety**: Zero critical security incidents; 100% GDPR compliance
5. **Clinical Validation**: Partner with 3-5 healthcare institutions for validation
6. **Sustainability**: Establish revenue model supporting free tier + premium features

---

## 4. Product Features & Capabilities

### 4.1 Core Features

#### **Feature 1: Glucose Entry & Analysis**
**Status**: ✅ Complete  
**Priority**: P0 (Critical)

**Description**: Multi-method glucose value input with intelligent analysis and storage.

**Capabilities**:
- Manual glucose entry with support for multiple units (mg/dL, mmol/L)
- Camera-based glucometer scanning using Tesseract OCR
- Automatic glucose value extraction from glucometer photos
- Support for fasting and random glucose tests
- Timestamped records with contextual metadata
- Historical glucose trend visualization

**Acceptance Criteria**:
- [ ] User can manually enter glucose values in <30 seconds
- [ ] OCR extraction accuracy: >95% for clear images
- [ ] Support for ±15% variance in manual entry
- [ ] Historical data persists across sessions
- [ ] Glucose interpretation provided (normal/high/low)

**Success Metrics**:
- Avg. entry time: <45 seconds
- OCR success rate: >90%
- Data retention: 100% (no loss)

---

#### **Feature 2: AI-Powered Health Assistant**
**Status**: ✅ Complete  
**Priority**: P0 (Critical)

**Description**: Context-aware AI chatbot providing personalized health guidance powered by Google Gemini API.

**Capabilities**:
- Multi-turn conversation with context awareness
- Glucose reading-based personalized recommendations
- Health-related query filtering (non-medical queries rejected)
- Suggested follow-up questions generation
- Educational content delivery
- Referral guidance for healthcare professionals

**Constraints**:
- ❌ Does NOT provide medical diagnoses
- ❌ Does NOT replace professional medical advice
- ❌ Does NOT process non-health-related queries
- ⚠️ Educational purposes only

**Acceptance Criteria**:
- [ ] Response latency: <5 seconds (p95)
- [ ] Health query accuracy: >90%
- [ ] Non-health query filter: >95% precision
- [ ] Context retention across 10+ turns
- [ ] Suggested questions generated within 2 seconds

**Success Metrics**:
- Avg. response time: 2-3 seconds
- User satisfaction (CSAT): >4.0/5.0
- Query processing accuracy: >92%

---

#### **Feature 3: Diabetes Risk Screening**
**Status**: ✅ Complete  
**Priority**: P0 (Critical)

**Description**: Multi-factor diabetes risk assessment questionnaire with evidence-based evaluation.

**Capabilities**:
- Comprehensive health questionnaire (age, BMI, family history, lifestyle)
- Evidence-based risk calculation algorithm
- Risk level categorization (Low/Moderate/High/Very High)
- Personalized recommendations based on risk profile
- Results explanation and next steps

**Data Inputs**:
- Age, gender
- Body Mass Index (BMI)
- Family history of diabetes
- Physical activity level
- Lifestyle factors (diet, smoking, stress)
- Previous health conditions

**Acceptance Criteria**:
- [ ] Questionnaire completion time: <5 minutes
- [ ] Risk calculation accuracy validated against medical standards
- [ ] All input validations enforced
- [ ] Clear risk level explanations provided
- [ ] Results persist for referral

**Success Metrics**:
- Completion rate: >85%
- Calculation accuracy: >90% (vs. medical benchmarks)
- User comprehension: >80% (post-quiz)

---

#### **Feature 4: Mobile Camera Integration**
**Status**: ✅ Complete  
**Priority**: P0 (Critical)

**Description**: Real-time camera access with image preprocessing for accurate glucometer scanning.

**Capabilities**:
- Real-time camera preview (mobile + desktop)
- Image preprocessing and enhancement
- Brightness/contrast auto-adjustment
- OCR recognition optimization
- Fallback to manual entry
- Camera permission management

**Acceptance Criteria**:
- [ ] Camera access latency: <1 second
- [ ] Image preprocessing time: <2 seconds
- [ ] Works on 95%+ of modern devices
- [ ] Graceful fallback on camera unavailability
- [ ] EXIF data stripped for privacy

**Success Metrics**:
- Camera success rate: >95%
- Processing time: <3 seconds
- Device compatibility: >98%

---

#### **Feature 5: Privacy & User Consent**
**Status**: ✅ Complete  
**Priority**: P0 (Critical)

**Description**: GDPR-compliant consent management and data privacy controls.

**Capabilities**:
- Explicit opt-in consent on app entry
- Transparent privacy policy display
- Clear data collection explanations
- User control over data sharing
- Data deletion requests (within 30 days)
- Secure data transmission (HTTPS)
- No third-party data sharing without consent

**Privacy Compliance**:
- ✅ GDPR Article 7 (explicit consent)
- ✅ HIPAA-aligned security practices
- ✅ Data minimization principles
- ✅ User data access/portability
- ✅ Right to deletion

**Acceptance Criteria**:
- [ ] Consent must be obtained before data collection
- [ ] Privacy policy available in app
- [ ] Data deletion processed within 30 days
- [ ] Audit trail for all data access
- [ ] Encryption at rest (AES-256)

**Success Metrics**:
- Consent rate: >90%
- Privacy complaint rate: <1%
- Data deletion turnaround: <15 days

---

### 4.2 Secondary Features (Phase 2)

#### **Feature 6: Health Tips & Education**
**Status**: ✅ Complete  
**Priority**: P1 (High)

**Description**: Curated educational content for diabetes prevention and management.

**Content Categories**:
- Dietary recommendations and recipes
- Physical activity guidelines
- Stress management techniques
- Sleep and lifestyle optimization
- Medication information (informational)
- Symptom awareness guides

**Content Strategy**:
- 30+ initial articles
- Evidence-based sourcing
- Regular updates (weekly)
- Multi-language support (Phase 2)
- Community contribution model

---

#### **Feature 7: Results & Reporting**
**Status**: ✅ Complete  
**Priority**: P0 (Critical)

**Description**: Comprehensive results page with visualization and referral options.

**Capabilities**:
- Glucose reading interpretation
- Risk assessment summary
- Personalized recommendations
- Healthcare provider referral resources
- Share results (print/export)
- Next steps guidance

---

#### **Feature 8: Referral & Care Coordination**
**Status**: ✅ Complete  
**Priority**: P1 (High)

**Description**: Connect users with qualified healthcare providers and resources.

**Capabilities**:
- Healthcare provider directory (by region)
- Appointment scheduling integration (Phase 2)
- Lab test recommendation guidance
- Follow-up care reminders
- Professional referral templates
- Telemedicine provider integration (Phase 2)

---

### 4.3 Future Features (Phase 2-3)

**Phase 2 (6-12 months)**:
- Multi-language support (Spanish, French, Swahili, Hindi, Mandarin)
- Wearable device integration (glucose monitors, smartwatches)
- Data export (PDF reports, HL7 FHIR format)
- Healthcare provider dashboard
- Family member access (with consent)
- Appointment scheduling integration

**Phase 3 (12-18 months)**:
- Offline-first functionality
- Voice-based glucose entry
- Predictive risk models (ML)
- Integration with electronic health records (EHR)
- Telemedicine appointment booking
- Pharmacy integration for medication management

---

## 5. User Personas

### Persona 1: **Amara** - Preventive Health Conscious
- **Age**: 35-45, female
- **Location**: Sub-Saharan Africa (Nigeria, Kenya)
- **Tech Comfort**: Moderate (smartphone user, limited desktop)
- **Goal**: Monitor health proactively; prevent chronic disease
- **Pain Point**: Limited access to regular health check-ups
- **Usage**: 3-4x per week

### Persona 2: **David** - Recent Diagnosis
- **Age**: 50-60, male
- **Location**: South Asia (India, Bangladesh)
- **Tech Comfort**: Low-to-Moderate
- **Goal**: Manage daily glucose; understand condition
- **Pain Point**: Healthcare costs; language barriers
- **Usage**: Daily glucose tracking

### Persona 3: **Maria** - Community Health Worker
- **Age**: 25-35, female
- **Location**: Remote area (multiple countries)
- **Tech Comfort**: Moderate
- **Goal**: Screen patients; provide education
- **Pain Point**: Limited diagnostic tools; no digital tracking
- **Usage**: Patient screening (5-10 per day)

### Persona 4: **Dr. Okafor** - Healthcare Professional
- **Age**: 40-55, male
- **Location**: Urban area (multiple countries)
- **Tech Comfort**: High
- **Goal**: Monitor patient health; coordinate care
- **Pain Point**: Paper records; fragmented data
- **Usage**: Patient review (10-20 per day) - Phase 2

---

## 6. User Journeys

### Journey 1: First-Time User (Preventive Care)
```
Landing → Privacy Consent → Risk Screening → Results Review 
  → Health Tips → Setup Complete
```

**Success Criteria**: User completes full journey in <10 minutes

### Journey 2: Returning User (Glucose Tracking)
```
Login → Enter Glucose (Manual/Camera) → View Results 
  → Chat with AI → View Recommendations → Save
```

**Success Criteria**: Complete entry-to-results in <3 minutes

### Journey 3: At-Risk User (High-Risk Assessment)
```
Risk Screening → Risk Results → Referral Resources 
  → Share with Healthcare Provider → Schedule Follow-up
```

**Success Criteria**: User obtains professional guidance within 7 days

---

## 7. Technical Architecture

### 7.1 Technology Stack

**Frontend**:
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast development)
- **Styling**: TailwindCSS + Framer Motion
- **State Management**: React Query + Wouter
- **UI Components**: Radix UI (40+ accessible components)

**AI & Processing**:
- **LLM**: Google Gemini 2.0 Flash API
- **OCR**: Tesseract.js (glucometer scanning)
- **Image Processing**: OpenCV.js + Canvas API
- **Medical NLP**: Custom filtering & context awareness

**Backend** (Future):
- **Runtime**: Node.js 18+
- **Framework**: Express.js / Fastify
- **Database**: PostgreSQL (health data)
- **Cache**: Redis (session management)
- **APIs**: RESTful + GraphQL (Phase 2)

**Infrastructure**:
- **Hosting**: Vercel (frontend) + Cloud Run (backend)
- **CDN**: Vercel Edge Network
- **Security**: HTTPS, CORS, CSP headers
- **Monitoring**: Sentry, LogRocket

---

### 7.2 System Architecture

```
┌─────────────────┐
│   Web Client    │  React 18 + TypeScript
│  (Vite Build)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
┌───▼──┐   ┌──▼───────┐
│Gemini│   │Tesseract │  Google APIs
│ API  │   │ OCR      │
└──────┘   └──────────┘
    │
    │
┌───▼──────────────┐
│ Vercel Backend   │  Future: API Layer
│ (Serverless)     │
└────────┬─────────┘
         │
    ┌────┴──────┐
    │            │
 ┌──▼──┐   ┌────▼────┐
 │ DB  │   │Cache    │
 │(PG) │   │(Redis)  │
 └─────┘   └─────────┘
```

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric | Target | Threshold |
|--------|--------|-----------|
| Page Load Time | <2s | <3s |
| API Response Time (p95) | <1s | <3s |
| OCR Processing | <2s | <5s |
| AI Response Time | <3s | <8s |
| Uptime | 99.5% | 99.0% |
| Mobile FCP | <1.5s | <2s |

### 8.2 Scalability

- **Concurrent Users**: 10,000+ simultaneous
- **Daily Active Users**: 100,000+ (Phase 2)
- **Database Capacity**: 1M+ user profiles
- **API Rate Limits**: 100 req/min per user (configurable)
- **Global CDN**: Content delivery <100ms worldwide

### 8.3 Reliability

- **Error Rate**: <0.1%
- **Data Loss**: 0%
- **Backup Frequency**: Daily (incremental), Weekly (full)
- **Recovery Time Objective (RTO)**: <4 hours
- **Recovery Point Objective (RPO)**: <1 hour

### 8.4 Security

- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Authentication**: OAuth 2.0 (Phase 2)
- **HIPAA Alignment**: Compliant data handling
- **GDPR Compliance**: Article 7 (consent), 17 (deletion)
- **Penetration Testing**: Quarterly security audits
- **Dependency Scanning**: Automated (Dependabot)

### 8.5 Accessibility

- **WCAG Compliance**: Level AA (minimum)
- **Screen Reader Support**: Full compatibility
- **Keyboard Navigation**: 100% of features
- **Color Contrast**: WCAG AA standards (4.5:1)
- **Mobile Responsiveness**: All breakpoints

---

## 9. Data Model & Storage

### 9.1 Core Entities

```
User
├── id (UUID)
├── email
├── created_at
├── consent_status
└── privacy_settings

GlucoseReading
├── id (UUID)
├── user_id (FK)
├── glucose_value (float)
├── unit (mg/dL | mmol/L)
├── test_type (fasting | random)
├── timestamp
├── source (manual | camera)
└── metadata (image_url, notes)

RiskScreening
├── id (UUID)
├── user_id (FK)
├── age
├── bmi
├── family_history
├── activity_level
├── risk_score
├── risk_level (Low|Moderate|High|VeryHigh)
├── created_at
└── recommendations

ChatHistory
├── id (UUID)
├── user_id (FK)
├── glucose_context
├── messages (array)
├── created_at
└── flagged (boolean)
```

### 9.2 Data Retention Policy

| Data Type | Retention | Deletion |
|-----------|-----------|----------|
| Health Data | Until deletion request | 30 days after request |
| Chat History | 12 months | Upon consent revocation |
| Audit Logs | 12 months | Automatic purge |
| Error Logs | 30 days | Automatic purge |
| User Profile | Until deletion | 30 days after request |

---

## 10. Integration Points

### 10.1 Third-Party APIs

**Google Gemini API**:
- Model: Gemini 2.0 Flash (latest)
- Use Case: AI health assistant
- Rate Limit: 100 req/day (free tier) → 10K req/day (paid)
- Error Handling: Graceful degradation with manual Q&A

**Tesseract OCR**:
- Use Case: Glucometer image scanning
- Model: Trained on medical devices
- Accuracy Target: >95% on clear images
- Fallback: Manual entry

**Google Cloud Vision API** (Phase 2):
- Use Case: Enhanced image analysis
- Focus: Medical chart reading, recipe analysis

**Healthcare Provider APIs** (Phase 2):
- Use Case: EHR integration, appointment scheduling
- Standards: HL7 FHIR, CCCD
- Examples: Epic, Cerner, OpenMRS

---

## 11. Success Metrics & KPIs

### 11.1 User Metrics

| KPI | Target (6mo) | Target (12mo) |
|-----|-------------|---------------|
| Total Users | 10K | 50K |
| Monthly Active Users (MAU) | 5K | 30K |
| Daily Active Users (DAU) | 2K | 15K |
| Retention (30-day) | 40% | 50% |
| Churn Rate | <10% | <8% |

### 11.2 Engagement Metrics

| KPI | Target |
|-----|--------|
| Avg. Session Duration | 5-8 minutes |
| Glucose Entries/User/Month | 8-12 |
| AI Chat Interactions | 2-3 per session |
| Health Tips Read | 10% of users |
| Feature Adoption | OCR: 40%, Chat: 60%, Risk: 95% |

### 11.3 Quality Metrics

| KPI | Target |
|-----|--------|
| App Crash Rate | <0.05% |
| Error Rate | <0.1% |
| OCR Accuracy | >95% |
| User Satisfaction (CSAT) | >4.0/5.0 |
| NPS Score | >40 |

### 11.4 Business Metrics

| KPI | Target (12mo) |
|-----|---------|
| Healthcare Professional Referrals | 100+ |
| Partnership Agreements | 3-5 |
| Clinical Validation Studies | 2-3 |
| Revenue (if applicable) | TBD |
| Cost per User Acquisition | <$5 |

---

## 12. Roadmap

### Phase 1: MVP (Current - Q2 2026) ✅
- [x] Glucose entry (manual + camera)
- [x] Risk screening
- [x] AI health assistant
- [x] Privacy & consent
- [x] Health tips
- [x] Results & referral

**Milestones**:
- May 2026: Feature complete
- June 2026: Beta launch (500 users)
- July 2026: Public launch

---

### Phase 2: Growth (Q3-Q4 2026)
- [ ] Multi-language support (5 languages)
- [ ] User authentication & accounts
- [ ] Healthcare provider dashboard
- [ ] Wearable device integration
- [ ] Appointment scheduling
- [ ] Enhanced analytics & trends
- [ ] Community features (forums)

**Goals**: 30K+ active users, healthcare partnerships

---

### Phase 3: Scale (Q1-Q2 2027)
- [ ] Predictive AI models
- [ ] EHR integration
- [ ] Telemedicine integration
- [ ] Offline functionality
- [ ] Voice-based entry
- [ ] Family/caregiver access
- [ ] Research data sharing (opt-in)

**Goals**: 100K+ active users, sustainable revenue

---

## 13. Compliance & Risk Management

### 13.1 Regulatory Compliance

**GDPR (EU/Global)**:
- ✅ Explicit consent mechanism
- ✅ Data minimization
- ✅ Right to deletion (within 30 days)
- ✅ Data access/portability
- ✅ Privacy policy transparency

**HIPAA (if applicable)**:
- ⚠️ Requires business associate agreements
- Planned: Phase 2 for healthcare provider features

**Medical Device Regulation (MDR/FDA)**:
- ⚠️ NOT a registered medical device (educational tool)
- Clear disclaimers: "Not for diagnosis or treatment"
- Future: Consider 510(k) approval (Phase 3) if clinical claims

**Data Protection Laws**:
- Nigeria: NDPR compliance
- India: Digital Personal Data Protection Act
- Brazil: LGPD compliance

### 13.2 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| API Rate Limiting | Medium | High | Implement caching, queue system |
| Data Breach | Low | Critical | Encryption, access controls, audits |
| OCR Accuracy Issues | Medium | Medium | Fallback to manual, user feedback |
| User Churn | High | Medium | Engagement features, push notifications |
| Regulatory Changes | Low | High | Legal monitoring, compliance team |
| Device Compatibility | Low | Medium | Progressive enhancement, testing |

---

## 14. Go-to-Market Strategy

### 14.1 Launch Channels

**Direct**:
- Website & app landing page
- App Store (iOS) & Play Store (Android)
- Social media (Instagram, TikTok, Facebook)

**Partnerships**:
- NGOs focused on diabetes prevention
- Community health organizations
- Healthcare networks

**Community**:
- Diabetes awareness campaigns
- Community health events
- Social media groups

### 14.2 User Acquisition

**Phase 1 (MVP)**: Organic growth, beta testing
- Target: 5K users through word-of-mouth
- Cost: Minimal (<$1K)

**Phase 2**: Paid acquisition + partnerships
- Target: 30K users
- Budget: $20-30K (CAC: $2-5 per user)
- Channels: Facebook, Instagram, Google, partner referrals

**Phase 3**: Scale & sustainability
- Target: 100K+ users
- Sustainable model with revenue optimization

---

## 15. Success Criteria & Exit Criteria

### Success Criteria (Q2 2026)
- ✅ All core features functional and tested
- ✅ 500+ beta users with positive feedback
- ✅ Zero critical security vulnerabilities
- ✅ GDPR compliance verified
- ✅ Clinical validation interest from 2+ institutions

### Exit/Pivot Criteria
- User growth stalls at <10K after 6 months
- Clinical validation shows inaccuracy >10%
- Regulatory blocking due to device classification
- Key dependencies (APIs) become unavailable
- Funding runway depleted without revenue path

---

## 16. User Interface (UI) Design & Layout

### 16.1 Design System

#### Color Palette

**Primary Colors:**
- **Primary Blue**: `#00459a` (Deep, professional medical blue)
  - Used for main CTAs, headlines, key actions
  - Conveys trust, healthcare, professionalism
  - Primary buttons, icons, active states
  - Hover effects with subtle lift

- **Background**: `#f9f9ff` (Nearly white with blue undertone)
  - Soft, clean, minimal visual distraction
  - Main page background
  - Accessible contrast with text
  - Reduces eye strain in medical context

- **On-Surface**: `#111c2d` (Deep navy-gray)
  - Primary text color
  - High contrast for readability (WCAG AA+)
  - Professional, trustworthy appearance

**Secondary Colors:**
- **Secondary Container**: `#d0e1fb` (Light lavender-blue)
  - Active tab/button backgrounds
  - Secondary action highlighting
  - Subtle visual separation from primary

- **Secondary**: `#505f76` (Muted gray-blue)
  - Secondary text, secondary icons
  - Inactive navigation items
  - Subtle secondary information

- **Surface Variants:**
  - **surface-container**: `#e7eeff` (Light blue-gray for cards)
  - **surface-container-low**: `#f0f3ff` (Lighter backgrounds)
  - **surface-container-highest**: `#d8e3fb` (Elevated surfaces)

**Status & Alert Colors:**
- **Error/High Risk**: `#ba1a1a` (Red) with container `#ffdad6`
  - Glucose levels exceeding threshold
  - Critical risk warnings
  - Left border accent on alert cards

- **Warning/Caution**: `#8B5000` (Brown-orange) with container `#FFECCF`
  - Elevated but manageable conditions
  - Missed activity goals
  - Left border accent on alert cards

- **Success/Normal**: Uses Primary Blue with checkmark icon
  - System sync successful
  - Normal glucose levels
  - Positive health indicators

**Outline Colors:**
- **outline**: `#727785` (Medium gray)
- **outline-variant**: `#c2c6d5` (Light gray for subtle borders)

#### Typography

**Font Families:**
- **Display Font**: "Manrope" (weights: 600, 700, 800)
  - Headlines, large titles
  - Bold, modern, confident appearance
  - Display-XL (48px), Headline-LG (32px), Headline-LG-Mobile (24px)

- **Body Font**: "Inter" (weights: 400, 600, 700)
  - Main text content, labels, buttons
  - Highly readable, clean, professional
  - Excellent screen legibility

**Font Sizes & Hierarchy:**
```
Display-XL:         48px, line-height 1.1, letter-spacing -0.02em, weight 700
Headline-LG:        32px, line-height 1.2, weight 600 (desktop)
Headline-LG-Mobile: 24px, line-height 1.2, weight 600 (mobile)
Title-MD:           20px, line-height 1.4, weight 600
Body-Base:          16px, line-height 1.6, weight 400
Body-SM:            14px, line-height 1.5, weight 400
Label-Caps:         12px, line-height 1, letter-spacing 0.05em, weight 600 (UPPERCASE)
```

#### Border Radius & Spacing

**Border Radius:**
- **Default (small)**: 0.25rem (4px) - Minimal rounding
- **lg**: 0.5rem (8px) - Small cards, buttons
- **xl**: 0.75rem (12px) - Medium cards
- **2xl**: Custom rounded-2xl (16px) - Large cards, hero sections
- **full**: 9999px - Circular elements (badges, avatars)

**Spacing Scale:**
```
stack-sm:       0.5rem (8px) - Compact spacing
stack-md:       1rem (16px) - Standard spacing
stack-lg:       2rem (32px) - Large gaps
margin-mobile:  1rem (16px) - Mobile padding
margin-desktop: 2rem (32px) - Desktop padding
gutter:         1.5rem (24px) - Column gaps
gap:            4px, 8px, 12px, 16px - Card internal spacing
```

#### Shadow & Glass Effects

**Shadow System:**
- **health-shadow**: `0px 4px 20px rgba(0, 92, 200, 0.05)` - Soft medical shadow
- **shadow-sm**: Subtle elevation for cards
- **shadow-lg**: Prominent shadows for floating elements (CTAs, alerts)
- **shadow-xl**: Maximum emphasis for image cards

**Glass-Morphism** (Desktop only):
- `.glass-card`: Background `rgba(255, 255, 255, 0.7)` with `backdrop-filter: blur(12px)`
- Border: `1px solid rgba(226, 232, 240, 0.8)`
- Creates frosted glass effect on hover states
- Hover effect: `hover:bg-white` for solid transition

#### Animations & Transitions

**Custom Animations:**
- **Ping Animation**: Used on hero icons (pulsing border effect on circular elements)
- **Scale Transitions**: Buttons scale `0.95` on active, `1.1` on hover
- **Translate Y**: CTAs move up 2px on hover (`-translate-y-2px`)
- **Backdrop Blur**: Navigation transitions with blur effect (200ms)
- **Duration**: Standard `duration-200` transitions throughout

**Interactive States:**
- **Hover**: Translate up + subtle shadow elevation
- **Active**: Scale to 0.95 (press effect) + 200ms transition
- **Focus**: Ring-2 with primary color (accessibility)
- **Disabled**: 50% opacity
- **Alert Cards**: Left border (4px) with status color

---

### 16.2 Page-by-Page Layout & Design

**Design Philosophy Update (May 2026):**
The UI has been redesigned with a modern, professional medical aesthetic using:
- **Material Design 3** principles (Google Material Symbols icons)
- **Glass-morphism effects** for premium feel (desktop)
- **Left-bordered alert cards** for status indication (mobile)
- **Bento grid layouts** for information architecture (desktop)
- **Bottom navigation** for mobile-first UX
- **Soft, medical color palette** centered on primary blue (#00459a)
- **Focus on trust and clarity** through status indicators (icon + color + text)

**Design Status:**
- ✅ **Page 1 (Welcome)**: Complete - Desktop & mobile designs documented
- ⏳ **Pages 2-7 (Remaining)**: Pending - Awaiting HTML mockups for adaptation

---

#### **Page 1: Welcome Screen** (`/`)

**Purpose**: Hero page introducing Gluco-Bridge, establishing credibility, driving user sign-up

**Layout Structure - Desktop View (2-Column Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Gluco-Bridge    Home Screening Input Results Health  [👤]   │  (Sticky header)
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┬─────────────────────────────┐
│                                     │                             │
│  [PRECISION HEALTH MONITORING]      │   ❤️ (Floating)            │
│  Take Control of Your               │                             │
│  Health Today                       │  ┌─────────────┐            │
│                                     │  │ High Risk   │            │
│  Bridge the gap between data        │  │ HbA1c up... │            │
│  and action. Our AI-powered...      │  │             │            │
│                                     │  └─────────────┘            │
│  [Get Started →] [Learn More]       │  ┌─────────────┐            │
│                                     │  │ Avg Glucose │            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │  │ 104 mg/dL  │            │
│  [👤👤 +2k] Trusted by thousands.  │  │             │            │
│                                     │  └─────────────┘            │
│                                     │  ┌─────────────┐            │
│                                     │  │ Activity    │            │
│                                     │  │ 8.4k steps  │            │
│                                     │  └─────────────┘            │
│                                     │  ┌─────────────┐            │
│                                     │  │ Caution     │            │
│                                     │  │ Sleep issue │            │
│                                     │  └─────────────┘            │
│                                     │                             │
└─────────────────────────────────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [Home ●] [Screening] [Input] [Results] [Health]      (Bottom)  │
└─────────────────────────────────────────────────────────────────┘
```

**Layout Structure - Mobile View (Single Column, Vertical Stack):**
```
┌─────────────────────────────────────┐
│  ☰  Gluco-Bridge        [👤]        │  (Sticky header)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                                     │
│    ❤️ (Animated in circle)         │
│    (pulsing border ring)            │
│                                     │
│    Take Control of Your             │
│    Health Today                     │
│                                     │
│    Monitor your vitals, track...   │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  SYSTEM STATUS                      │
│                                     │
│  ⚠️ High Risk                       │  (Red left-border alert)
│  Glucose levels exceeded...         │
│                                     │
│  ⚠️ Caution                         │  (Orange left-border alert)
│  Missed afternoon activity...       │
│                                     │
│  ✓ Normal                           │  (Blue left-border alert)
│  System sync successful...          │
│                                     │
└─────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│ Avg Glucose  │ Last Scan    │ Activity     │  (3-column stat grid)
│ 112 mg/dL    │ 2m ago       │ 72% Goal     │
└──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────┐
│  [Large Image with Gradient]        │
│  Health Coaching                    │
│  Connect with a specialist...       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [Start New Screening →]            │  (Floating above nav)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [Home●] [Screen] [Input] [Results]  │  (Bottom nav)
└─────────────────────────────────────┘
```

**Key Desktop Components:**

1. **Header (Sticky)**
   - Logo + "Gluco-Bridge" with primary color
   - Navigation menu (hidden on mobile)
   - User profile avatar (right-aligned)
   - Background: surface with shadow
   - Height: 64px

2. **Left Column (Hero Content)**
   - Badge: "PRECISION HEALTH MONITORING" (secondary-container background)
   - Headline: Display-XL size (48px on desktop, 24px mobile)
   - Description: Body-base font
   - CTA Buttons:
     - Primary: "Get Started" with arrow icon (primary blue, scale on hover)
     - Secondary: "Learn More" (outlined, gray border)
   - Trust metrics: Avatar stack (+2k indicator) with text

3. **Right Column (Bento Grid - Desktop Only)**
   - 2x2 grid layout with glass-morphism cards
   - Floating heart icon (absolute positioned, -top-12)
   - Cards use glass effect: `rgba(255,255,255,0.7)` with `blur(12px)`
   - Hover: Transition to solid white background
   - Card contents:
     - High Risk: Icon + status label + description
     - Avg Glucose: Icon + value + unit
     - Activity: Icon + value + unit
     - Caution: Icon + status label + description

**Key Mobile Components:**

1. **Hero Section (Centered)**
   - Circular animated heart icon (24px circle, pulsing border ring)
   - Large headline centered
   - Centered description text

2. **Alert Boxes (Stack Vertical)**
   - Left border (4px) with color-coded accent
   - Error (red): `border-error` with red icon
   - Warning (brown): `border-[#8B5000]` with warning icon
   - Success (blue): `border-primary` with check icon
   - Interior: Icon + title + description
   - Shadows: rgba shadow with status color

3. **Stats Grid (3-Column)**
   - Small cards in row
   - Centered content
   - Label: label-caps (uppercase, small)
   - Value: title-md (bold)
   - Unit: tiny text below
   - Border: outline-variant, subtle shadow

4. **Image Card**
   - Full-width image with gradient overlay
   - Gradient direction: top-to-bottom with primary color (80% opacity)
   - Text overlay (bottom-left): white text
   - Rounded corners (rounded-2xl)

5. **Floating CTA Button**
   - Fixed position: bottom-24 (above nav)
   - Full-width with margin
   - Primary blue background
   - Icon + text centered
   - Shadow-lg

**Color Usage:**

- **Primary Blue (#00459a)**:
  - Headlines, logo, icons
  - Primary CTA buttons
  - Stats values
  - Success indicators

- **Secondary Container (#d0e1fb)**:
  - Badge background
  - Active nav indicator

- **On-Surface (#111c2d)**:
  - Body text
  - Descriptions

- **On-Surface-Variant (#424753)**:
  - Secondary text
  - Captions

- **Error (#ba1a1a)** + **Error-Container (#ffdad6)**:
  - High Risk alerts
  - Left border, text, background

- **Warning (#8B5000)** + **Container (#FFECCF)**:
  - Caution alerts
  - Custom brown-orange color

**Responsive Behavior:**

- **Desktop (1024px+)**: 2-column layout, hero on left, bento grid on right
- **Tablet (768px-1024px)**: Transition to stacked single column
- **Mobile (<768px)**: Full vertical stack, bottom nav replaces desktop nav

**Typography Application:**

- Headline: Display-XL (desktop) / Headline-LG-Mobile (mobile)
- Badge: Label-Caps (12px, uppercase)
- Body: Body-Base (16px) for descriptions
- Stats: Title-MD (20px) for values
- Secondary text: Body-SM (14px)

---

#### **Page 2: Risk Screening** (`/screening`)

**Purpose**: Multi-step questionnaire to assess diabetes risk

**Status**: ✅ Complete - Desktop design implemented

**Layout Structure - Card-Based Form (Desktop & Mobile):**
```
┌────────────────────────────────────────┐
│  Risk Screening        Step 1 of 3      │  (Header with step indicator)
├────────────────────────────────────────┤
│  ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░   │  (Progress bar - animated)
├────────────────────────────────────────┤
│                                        │
│  Personal Information                  │  (H3 Title)
│  We need a few details...             │  (Subtitle text)
│                                        │
│  [Age input]   [Activity dropdown]    │  (2-column grid)
│  [Height input] [Weight input]        │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ ❤️ Why this matters              │ │  (Visual reference box)
│  │ Body mass and activity levels... │ │
│  └──────────────────────────────────┘ │
│                                        │
├────────────────────────────────────────┤
│                         [Next →]       │  (Footer CTA)
└────────────────────────────────────────┘

🔒 Your data is encrypted...  (Privacy message)
```

**Key Desktop Features:**

1. **Card Container**
   - Max-width: 896px (max-w-2xl)
   - Centered with padding
   - Border: outline-variant/30 (subtle)
   - Shadow: diffuse-shadow (0px 4px 20px rgba(0, 92, 200, 0.05))
   - Border radius: rounded-xl (12px)

2. **Progress Section**
   - Header: font-title-md "Risk Screening" + step label (outline color)
   - Progress bar: 2px height, bg-surface-container-high
   - Animated fill: primary color, smooth 500ms transition

3. **Form Step Sections**
   - Step 1: Personal Information (Age, Activity, Height, Weight)
   - Step 2: Health History (Family History, High BP)
   - Step 3: Symptoms (Fatigue, Thirst, Urination, Vision)
   - Transitions: Fade + slide animation (300ms)

4. **Form Inputs**
   - Border: 1px solid outline
   - Focus state: Ring-2 ring-primary
   - Units displayed inline (right-aligned)
   - Background: surface (white)
   - Padding: px-4 py-3

5. **Checkbox Cards**
   - Full-width clickable area
   - Border: 2px outline-variant (default), 2px primary (selected)
   - Background: surface (default), primary/5 (selected)
   - Rounded corners: rounded-lg
   - Checkmark icon or text ("✓")

6. **Visual Reference Box**
   - Background: surface-container-low
   - Border: primary/10
   - Icon circle: bg-primary-container, text-primary, 12px size
   - Layout: flex items-start gap-4
   - Text: label-caps + body-sm

7. **Footer CTA**
   - Background: primary color
   - Text: on-primary (white)
   - Padding: px-8 py-3
   - Border-radius: rounded-lg
   - Active: scale-95 (press effect)
   - Hover: shadow-lg + translate icon

8. **Privacy Message**
   - Centered text below card
   - Icon + text layout
   - Color: on-surface-variant (secondary text)

**Color Scheme:**
- **Primary**: Bright blue (#00459a) - buttons, highlights, focus rings
- **Surface**: White - card and input backgrounds
- **On-Surface**: Dark navy - main text
- **On-Surface-Variant**: Gray - secondary text, labels
- **Outline**: Medium gray - borders
- **Error Container**: Light red - error messages
- **Primary-Container**: Light blue - icon backgrounds

**Form Grid Layout:**
- **Desktop (md+)**: grid-cols-2 (2 columns, 6 units gap)
- **Mobile**: grid-cols-1 (1 column, full width)
- Input wrapper: flex flex-col gap-2

**Typography Application:**
- Title: font-title-md (20px, weight 600)
- Subtitle: font-body-sm (14px, weight 400)
- Labels: font-label-caps (12px, uppercase, weight 600)
- Placeholder text: on-surface-variant color

**Responsive Behavior:**
- Mobile: Single column, card takes full width with padding
- Desktop: 2-column form grid, centered container
- Sticky header on scroll (when implemented)

**Animations:**
- Progress bar: Smooth width transition (500ms)
- Page transitions: Fade + slide (300ms ease-in-out)
- Hover effects: Scale 1.02 on interactive cards
- Button press: scale-95 (200ms transition)

---

#### **Page 3: Glucose Entry** (`/glucose`)

**Purpose**: Manual glucose input or camera-based glucometer reading

**Status**: ✅ Complete - Desktop & Mobile design implemented

**Layout Structure - Tabbed Input Interface (Mobile First):**
```
┌────────────────────────────────────────┐
│  Manual Entry  │ Camera Scan (Tab)     │  (View switcher)
├────────────────────────────────────────┤
│                                        │
│  Glucose Value              [mg/dL]    │  (Unit toggle)
│                                        │
│              000                       │  (Large display)
│                                        │
│  TIMING              FEELING            │  (2-column grid)
│  [Before Meal ▼]  [😊] [😐] [🤒]      │
│                                        │
├────────────────────────────────────────┤
│  LAST ENTRY        AVG 7D              │  (Quick history bento)
│  98 mg/dL          112 mg/dL           │
│  2 hours ago       [████░░░░] 7D      │
├────────────────────────────────────────┤
│                  [Log Glucose Level →] │  (CTA button)
└────────────────────────────────────────┘

🔒 Your data is encrypted...  (Privacy message)
```

**Key Features:**

1. **Tab Switcher**
   - 2 tabs: "Manual Entry" | "Camera Scan"
   - Background: surface-container
   - Active: bg-surface, text-primary
   - Inactive: text-on-surface-variant
   - Rounded: rounded-xl
   - Padding: p-1

2. **Unit Toggle**
   - Background: secondary-fixed (pill-shaped)
   - Buttons: mg/dL, mmol/L
   - Active: bg-surface, text-primary
   - Inactive: text-on-secondary-fixed-variant
   - Layout: Horizontal flex group

3. **Large Glucose Input**
   - Font: font-display-xl (64px)
   - Color: text-primary
   - Alignment: center
   - Background: transparent
   - Placeholder: "000" (subtle color)
   - Input type: number

4. **Timing Dropdown**
   - Label: font-label-caps
   - Options: Before Meal, After Meal, Fasting, Bedtime
   - Border: outline
   - Focus ring: ring-2 ring-primary
   - Background: surface-container-low
   - Styling: font-body-sm, rounded-lg

5. **Feeling Emoji Buttons**
   - 3 options: 😊 (good), 😐 (neutral), 🤒 (sick)
   - Size: text-2xl
   - Active state: bg-primary, text-white, scale-110, shadow-md
   - Inactive: bg-surface-container-low, hover:bg-surface-container
   - Animation: Smooth scale transition

6. **Quick History Bento**
   - Last Entry Card:
     - Background: surface-container-high
     - Shows: 98 mg/dL, 2 hours ago
     - Subtitle: on-surface-variant color
   - Avg 7D Card:
     - Background: secondary-container
     - Shows: 112 mg/dL + mini bar chart
     - Progress bar: bg-primary, w-3/4 h-1
     - Text: on-secondary-fixed

7. **Log Glucose Button**
   - Background: primary color
   - Text: on-primary (white)
   - Padding: py-4, px-full
   - Border-radius: rounded-xl
   - Hover effect: scale-95 on click
   - Arrow icon: animate on hover
   - Width: w-full

8. **Camera View**
   - Alternative to manual entry
   - Camera icon circle: bg-primary-container
   - "Take Photo" button group (2-column)
   - Upload photo support

9. **Bottom Navigation (Mobile)**
   - Fixed bottom, z-50
   - Flex layout with 5 nav items
   - Active item: secondary-container background
   - Icons: home, health_and_safety, add_circle (filled), analytics, lightbulb
   - Typography: font-label-caps text-[10px]
   - Backdrop blur: md:hidden on desktop

10. **Top App Bar (Sticky)**
    - Logo, navigation cluster (desktop only)
    - User profile avatar (top right)
    - Height: h-16
    - Background: surface
    - Shadow: diffuse-shadow

**Color Scheme:**
- **Primary**: Bright blue - inputs, active states, icons
- **Surface**: White - backgrounds
- **Secondary Container**: Light blue - active navigation
- **Surface-Container-Low**: Very light blue - inactive states
- **Text colors**: on-surface (main), on-surface-variant (secondary)

**Responsive Behavior:**
- **Mobile (< md)**:
  - Single column layout
  - Tab switcher full width
  - Bottom navigation visible
  - Hide top navigation cluster
- **Desktop (md+)**:
  - Navigation cluster in header
  - Bottom navigation hidden
  - Centered container (max-w-2xl)

**Animations:**
- Tab switch: Smooth fade (300ms)
- Emoji button select: Scale 1.1 + shadow
- Button press: Scale 0.95
- Hover effects: Translate icon on arrow

**Form Validation:**
- Real-time glucose value validation
- Error/warning display below input
- Button disabled until valid input

**Data Captured:**
- Glucose value (number)
- Unit (mg/dL or mmol/L)
- Timing (before/after/fasting/bedtime)
- Feeling (good/neutral/sick)

---

#### **Page 4: Results & AI Chat** (`/results`)

**Purpose**: Display glucose interpretation, AI guidance, and chat interface

**Status**: Awaiting design HTML update

---

#### **Page 5: Health Tips** (`/health-tips`)

**Purpose**: Educational content about diabetes prevention

**Status**: Awaiting design HTML update

---

#### **Page 6: Referral Resources** (`/referral`)

**Purpose**: Connect users with healthcare providers and resources

**Status**: Awaiting design HTML update

---

#### **Page 7: BMI Calculator** (`/bmi`)

**Purpose**: Calculate and track BMI

**Status**: Awaiting design HTML update

---

### 16.3 Component Library

**Icon System:**
- **Material Symbols Outlined** (Google Material Design Icons)
- Custom font variation settings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`
- Used throughout for consistency and accessibility

**Common Icons:**
- Navigation: `home`, `menu`, `health_and_safety`, `add_circle`, `analytics`, `lightbulb`
- Status: `favorite` (heart fill), `warning`, `error`, `check_circle`
- Actions: `arrow_forward`, `person`, `arrow_back`
- Health: `bloodtype`, `directions_run`
- Info: `info`

**Button Components:**
- **Primary Button**: Primary blue background, white text, scale on active
- **Secondary Button**: Outlined border (outline color), hover background
- **Icon Button**: Square or circular, outline variant
- **Navigation Button**: Text + icon, color-coded based on active state
- **Floating Action Button (FAB)**: Fixed position, shadow-lg, scale interaction

**Card Components:**
- **Glass Card** (Desktop): Frosted glass effect with backdrop blur
- **Standard Card**: White/surface background with subtle shadow
- **Alert Card**: Left border (4px) with status color, icon + text layout
- **Stat Card**: Centered content, small dimensions, minimal design
- **Image Card**: Full-width with gradient overlay, text positioned bottom-left

**Form Components:**
- **Text Input**: Light border, focus ring with primary color
- **Label**: Label-caps font (uppercase, small)
- **Radio Button**: Custom styled with color indicators
- **Checkbox**: Custom styled, checkmark icon
- **Progress Bar**: Primary color fill, subtle background

**Navigation:**
- **Top App Bar**: Sticky header with logo, nav menu (desktop), user avatar
- **Bottom Navigation**: Fixed mobile nav, 5 main sections, active indicator
- **Breadcrumb**: Show hierarchy (not currently used in Welcome)

**Layout Containers:**
- **Max-Width Container**: `max-w-container-max` (1152px), centered with margin
- **Grid System**: 2-column (desktop), 1-column (mobile), 3-column (stats)
- **Spacing**: Consistent padding using `margin-mobile` (1rem) and `margin-desktop` (2rem)

---

### 16.4 Responsive Breakpoints

**Tailwind Breakpoints:**
```
Mobile (default):  320px - 640px
Tablet (sm):       640px
Tablet (md):       768px
Desktop (lg):      1024px
Large Desktop (xl): 1280px
XL (2xl):          1536px
```

**Welcome Page Breakpoints:**
- **Mobile**: Single column, bottom navigation, floating action button
- **Tablet (md)**: Transition point, hidden desktop nav
- **Desktop (lg)**: 2-column layout, top navigation, bento grid right column

**Layout Strategy:**
- Single column on mobile (vertical stack)
- Flexible 2-column on desktop (hero left, grid right)
- Hidden desktop elements on mobile (nav menu, bento grid)
- Visible bottom nav on mobile only
- Hero section centers on mobile, left-aligned on desktop

**Mobile Optimizations:**
- Touch-friendly button sizes (min 44x44px)
- Full-width inputs and buttons
- Large tap targets for navigation
- Simplified layouts (single column)
- Floating CTAs positioned above bottom nav
- Bottom sheets for modals instead of centered

**Desktop Optimizations:**
- 2-3 column layouts
- Side-by-side content
- Horizontal navigation
- Hover effects (translate-y, scale, bg-color)
- Glass-morphism effects
- Avatar stacks for social proof

---

### 16.5 Accessibility Features

**WCAG 2.1 AA Compliance:**
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support (semantic HTML, ARIA labels)
- ✅ Color contrast: Primary text on background meets 4.5:1 ratio
- ✅ Focus indicators: Ring-2 with primary color on all interactive elements
- ✅ Alt text for all images (data-alt attribute)
- ✅ Form labels associated with inputs
- ✅ Icon + text labels used together (never icon-only)
- ✅ Status conveyed by icon + color + text (not color alone)

**Color Accessibility:**
- Icons paired with text for status indication (error + warning + check)
- Status colors distinct by hue (blue, red, orange, not just saturation)
- High contrast for critical alerts
- Support for color-blind users (icons + patterns)

**Motor Accessibility:**
- Large button targets (minimum 44x44px)
- Adequate spacing between interactive elements
- No hover-only content
- Keyboard-accessible navigation
- No double-click requirements

**Cognitive Accessibility:**
- Clear, simple language in labels and descriptions
- Consistent navigation patterns
- Logical tab order
- Status messages visible and clear
- Warning alerts prominent (left border + icon + text)

---

### 16.6 Performance Optimizations

**Visual Performance:**
- Material Symbols for lightweight iconography
- Backdrop blur (CSS filter, GPU accelerated)
- Scale/translate animations (hardware accelerated)
- Minimal re-renders with proper CSS
- Lazy loading for images (data-alt for AI generation)

**Loading States:**
- Skeleton screens not shown (instant content from API)
- Loading spinners on buttons during async actions
- Toast notifications for feedback
- Optimistic UI updates

**CSS & Bundle:**
- Tailwind CSS with JIT compilation
- Custom shadow utilities (health-shadow)
- Custom animations (ping for pulsing)
- No CSS-in-JS overhead
- Icon font vs. SVGs (smaller payload)

---

## 17. Design Tokens & Implementation Reference

### 17.1 Tailwind Configuration

**Extended Theme Colors** (27 custom colors defined):

```css
Primary Color System:
- primary:                    #00459a (Main brand color)
- primary-fixed:              #d8e2ff (Light variant for backgrounds)
- primary-fixed-dim:          #aec6ff (Slightly darker variant)
- on-primary:                 #ffffff (Text on primary)
- on-primary-fixed:           #001a42 (Text on primary-fixed)
- primary-container:          #005cc8 (Stronger primary for emphasis)
- on-primary-container:       #cfdcff (Text on primary-container)
- on-primary-fixed-variant:   #004396 (Alternative text on primary)

Secondary Color System:
- secondary:                  #505f76 (Secondary accent)
- secondary-fixed:            #d3e4fe (Light secondary)
- secondary-fixed-dim:        #b7c8e1 (Dimmed secondary)
- secondary-container:        #d0e1fb (Background for active states)
- on-secondary:               #ffffff (Text on secondary)
- on-secondary-fixed:         #0b1c30 (Dark text on secondary-fixed)
- on-secondary-container:     #54647a (Text on secondary-container)
- on-secondary-fixed-variant: #38485d (Alternative text)

Tertiary & Neutral:
- tertiary:                   #46494b (Neutral accent)
- tertiary-fixed:             #e0e3e5 (Light tertiary)
- tertiary-fixed-dim:         #c4c7c9 (Dimmed tertiary)
- on-tertiary:                #ffffff (White text)
- on-tertiary-fixed:          #191c1e (Dark text on tertiary-fixed)
- on-tertiary-container:      #dadcde (Text on container)

Surface & Background:
- background:                 #f9f9ff (Main background)
- surface:                    #f9f9ff (Card/surface background)
- surface-bright:             #f9f9ff (Brightest surface)
- surface-dim:                #cfdaf2 (Darker surface)
- surface-container:          #e7eeff (Container for content)
- surface-container-low:      #f0f3ff (Low emphasis container)
- surface-container-high:     #dee8ff (High emphasis container)
- surface-container-highest:  #d8e3fb (Highest emphasis container)
- surface-container-lowest:   #ffffff (Pure white)
- surface-variant:            #d8e3fb (Variant background)

Error & Status:
- error:                      #ba1a1a (Error/danger red)
- error-container:            #ffdad6 (Light red for error background)
- on-error:                   #ffffff (White text on error)
- on-error-container:         #93000a (Dark text on error-container)

Text Colors:
- on-surface:                 #111c2d (Primary text)
- on-surface-variant:         #424753 (Secondary text)
- on-background:              #111c2d (Text on background)

Borders & Outlines:
- outline:                    #727785 (Medium-weight border)
- outline-variant:            #c2c6d5 (Light-weight border)

Functional:
- surface-tint:               #005ac4 (Tint overlay color)
- inverse-surface:            #263143 (Inverse background)
- inverse-primary:            #aec6ff (Inverse primary)
- inverse-on-surface:         #ecf1ff (Inverse text)
```

**Custom Spacing:**
```
gutter:          1.5rem (24px) - Gap between columns
stack-lg:        2rem (32px) - Large section spacing
stack-md:        1rem (16px) - Standard spacing
stack-sm:        0.5rem (8px) - Compact spacing
margin-desktop:  2rem (32px) - Desktop padding
margin-mobile:   1rem (16px) - Mobile padding
container-max:   1152px - Maximum content width
```

**Custom Border Radius:**
```
DEFAULT:  0.25rem (4px)  - Default small radius
lg:       0.5rem (8px)   - Medium radius
xl:       0.75rem (12px) - Large radius
full:     9999px         - Fully circular
```

**Font Families & Sizes:**
```
body-base:             Inter 16px, line-height 1.6, weight 400
display-xl:            Manrope 48px, line-height 1.1, weight 700
title-md:              Inter 20px, line-height 1.4, weight 600
label-caps:            Inter 12px, line-height 1, weight 600 (UPPERCASE)
body-sm:               Inter 14px, line-height 1.5, weight 400
headline-lg-mobile:    Manrope 24px, line-height 1.2, weight 600
headline-lg:           Manrope 32px, line-height 1.2, weight 600
```

---

### 17.2 Custom CSS Classes

**Glass-Morphism Effect:**
```css
.glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.8);
}
```

**Shadow Effects:**
```css
.health-shadow {
    box-shadow: 0px 4px 20px rgba(0, 92, 200, 0.05);
}
```

**Material Symbols Configuration:**
```css
.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

---

### 17.3 Implementation Notes

**Header (Top App Bar):**
- Height: 64px (h-16)
- Position: Sticky (sticky top-0 z-50)
- Shadow: Subtle health-shadow
- Responsive: Logo visible always, nav menu hidden on mobile, avatar visible always

**Navigation (Bottom Nav - Mobile Only):**
- Position: Fixed bottom (fixed bottom-0)
- Height: Auto with padding
- Z-index: 50 (overlays content)
- Backdrop: Blur effect (backdrop-blur-md)
- Active indicator: Secondary-container background with rounded pill shape

**Floating Action Button:**
- Position: Fixed above nav (fixed bottom-24)
- Width: Full with margins
- Shadow: shadow-lg
- Interaction: active:scale-95 (press effect)

**Alert Cards:**
- Left border: 4px solid (border-l-4)
- Padding: stack-md on all sides
- Border radius: rounded-xl (12px)
- Shadow: Custom rgba shadow matching status color (0.05 opacity)
- Color variants:
  - Error: bg-error-container, border-error, text-error
  - Warning: bg-[#FFECCF], border-[#8B5000], text-[#2A1700]
  - Success: bg-primary-container/10, border-primary, text-primary

**Stat Cards:**
- Padding: stack-sm
- Border radius: rounded-xl
- Background: surface with subtle border
- Shadow: shadow-sm
- Content: Centered with flex column layout

**Grid Layouts:**
- 2-column: `grid grid-cols-2 gap-4` (Bento grid on desktop)
- 3-column: `grid grid-cols-3 gap-stack-sm` (Stats grid)
- Responsive: `lg:grid-cols-2` (desktop) / default single column (mobile)

**Image Cards:**
- Aspect ratio: Custom height (h-48)
- Image: `absolute inset-0 w-full h-full object-cover`
- Overlay: `bg-gradient-to-t from-primary/80 to-transparent`
- Text: Positioned `absolute bottom-4 left-4 right-4` with white text

**Typography Pairing:**
- Headline: Display-XL (Manrope) + Body text (Inter)
- Labels: Label-caps (Inter, uppercase, small)
- Descriptions: Body-base (Inter, regular weight)

---

- **AI Assistant**: Google Gemini-powered chatbot for health guidance
- **Glucose Reading**: Blood sugar measurement (mg/dL or mmol/L)
- **OCR**: Optical Character Recognition (glucometer scanning)
- **Risk Screening**: Multi-factor diabetes risk assessment
- **Fasting Glucose**: Blood sugar measured after 8+ hours fasting
- **Random Glucose**: Blood sugar measured at any time
- **GDPR**: General Data Protection Regulation (EU privacy law)
- **HIPAA**: Health Insurance Portability & Accountability Act (US)
- **NPS**: Net Promoter Score (customer satisfaction metric)
- **CAC**: Customer Acquisition Cost

### Appendix B: References

- World Health Organization - Global Diabetes Report
- American Diabetes Association - Standards of Care
- GDPR Official Guidance (europa.eu)
- WCAG 2.1 Accessibility Guidelines
- OWASP Security Best Practices

### Appendix C: Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Manager | [Name] | May 11, 2026 | _______ |
| Engineering Lead | [Name] | May 11, 2026 | _______ |
| Design Lead | [Name] | May 11, 2026 | _______ |
| Legal/Compliance | [Name] | May 11, 2026 | _______ |

---

**Document Version**: 1.0  
**Last Updated**: May 11, 2026  
**Next Review**: August 11, 2026  
**Status**: Active
