# Google Ads Setup Guide

## 🎯 Step 1: Create Google Ads Conversion Actions

### In your Google Ads account:

1. **Go to Tools & Settings** → **Conversions**
2. **Create New Conversion Action** → **Website**

### Create these conversion actions:

#### 1. Purchase Conversion (Primary)
- **Category**: Purchase  
- **Value**: Use different values for each conversion
- **Count**: One per conversion
- **Attribution model**: Last click
- **Conversion window**: 30 days

#### 2. Begin Checkout (Micro-conversion)
- **Category**: Other
- **Value**: Use different values for each conversion  
- **Count**: One per conversion
- **Attribution model**: Last click
- **Conversion window**: 7 days

## 🔧 Step 2: Get Your Conversion IDs

After creating conversions, you'll get:
- **Conversion ID**: `AW-XXXXXXXXX`
- **Conversion Labels**: 
  - Purchase: `PURCHASE_CONVERSION_LABEL`
  - Begin Checkout: `BEGIN_CHECKOUT_LABEL`

## ⚙️ Step 3: Update Code

Replace these placeholders in `/src/lib/analytics.ts`:

```typescript
// Replace this line:
const GOOGLE_ADS_ID = 'AW-XXXXXXXXX';

// With your actual Conversion ID:
const GOOGLE_ADS_ID = 'AW-1234567890';
```

```typescript
// Replace these lines:
trackGoogleAdsConversion('PURCHASE_CONVERSION_LABEL', value, 'SAR');
trackGoogleAdsConversion('BEGIN_CHECKOUT_LABEL', value, 'SAR');

// With your actual labels:
trackGoogleAdsConversion('AbC123dEf', value, 'SAR');
trackGoogleAdsConversion('XyZ789mNo', value, 'SAR');
```

Also update `/index.html`:
```html
<!-- Replace this line: -->
// gtag('config', 'AW-XXXXXXXXX');

<!-- With your actual ID: -->
gtag('config', 'AW-1234567890');
```

## 📊 Step 4: Campaign Optimization

### Smart Bidding Strategies:
- **Target CPA**: Optimize for conversions at your desired cost
- **Target ROAS**: Optimize for return on ad spend
- **Maximize Conversions**: Get most conversions within budget

### Audience Setup:
- **Website visitors** (remarketing)
- **Similar audiences** based on converters
- **Customer Match** (upload customer emails)

## 🧪 Step 5: Testing

1. **Test conversions** in Google Ads preview
2. **Check Google Analytics** for event tracking
3. **Verify conversion attribution** in Google Ads

## 📈 Campaign Structure Recommendation:

### Campaign Types:
1. **Search Campaign** - Target high-intent keywords
2. **Display Remarketing** - Re-engage website visitors  
3. **YouTube Campaign** - Video ads for awareness
4. **Performance Max** - Automated cross-platform

### Key Metrics to Track:
- Conversion Rate
- Cost Per Conversion  
- Return on Ad Spend (ROAS)
- Quality Score
- Click-Through Rate (CTR)

## 🎯 Recommended Keywords:
- خدمة النقل للمعتمرين
- استقبال المعتمرين مطار جدة
- نقل من مطار جدة للحرم
- عمرة مع نقل
- باص المعتمرين جدة

## 💡 Pro Tips:
- Use **conversion value optimization** for better ROAS
- Set up **enhanced conversions** for better tracking
- Create **custom audiences** based on page visits
- Test **different ad copy** highlighting your key benefits