# Analytics Setup Guide

Track visitor locations and usage statistics for your California Housing Price Predictor.

## Option 1: Google Analytics 4 (Recommended - Free & Comprehensive)

### Setup Steps:

1. **Create Google Analytics Account**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Sign in with your Google account
   - Click "Start measuring"
   - Fill in Account details, Property details
   - Select "Web" as the platform
   - Enter your URL: `https://ammarshafi1.github.io/AI2-California-Housing-Page/`

2. **Get Your Measurement ID**
   - After creating the property, you'll get a Measurement ID like: `G-XXXXXXXXXX`
   - Copy this ID

3. **Add Analytics to Your Site**
   - Open `index.html`
   - Replace `G-XXXXXXXXXX` in the analytics code with your actual Measurement ID
   - Commit and push to GitHub

4. **View Analytics**
   - Go to Google Analytics dashboard
   - Navigate to Reports > User Attributes > Demographics > Geography
   - See visitor cities, countries, and regions!

### Features You'll Get:

✅ **Geographic Data**: Cities, countries, regions  
✅ **Real-time visitors**: See live traffic  
✅ **Device breakdown**: Mobile vs Desktop  
✅ **Traffic sources**: Where visitors come from  
✅ **Page views**: Most popular sections  
✅ **User engagement**: Time on site, bounce rate  
✅ **Custom events**: Track predictions made  

### Privacy Considerations:

- Google Analytics collects IP addresses (anonymized by default in GA4)
- Sets cookies in user browsers
- Subject to GDPR/privacy laws
- You should add a privacy policy

---

## Option 2: Plausible Analytics (Privacy-Friendly)

### Why Choose Plausible:

✅ No cookies  
✅ GDPR compliant by default  
✅ Lightweight (< 1KB script)  
✅ Open source  
❌ Paid service ($9/month, but 30-day free trial)

### Setup:

1. Sign up at [plausible.io](https://plausible.io/)
2. Add your domain: `ammarshafi1.github.io`
3. Add this script to `index.html`:

```html
<script defer data-domain="ammarshafi1.github.io" src="https://plausible.io/js/script.js"></script>
```

4. View analytics in your Plausible dashboard

---

## Option 3: Simple Analytics (Privacy-First)

### Features:

✅ No cookies  
✅ GDPR compliant  
✅ Simple dashboard  
❌ Paid ($19/month, has free trial)

### Setup:

1. Sign up at [simpleanalytics.com](https://simpleanalytics.com/)
2. Add tracking script (provided after signup)
3. View geographic data in dashboard

---

## Option 4: Free Alternative - Cloudflare Analytics

If you move your site to Cloudflare Pages (still free):

✅ Free forever  
✅ Privacy-respecting  
✅ Geographic data included  
✅ No JavaScript required (server-side)

---

## Custom Event Tracking

Track specific actions like "Prediction Made":

### Google Analytics 4:

```javascript
// Track when user makes a prediction
gtag('event', 'prediction_made', {
  'median_income': features[0],
  'predicted_price': predictionDollars
});
```

### Plausible:

```javascript
// Track custom events
plausible('Prediction Made', {
  props: { price_range: getPriceRange(predictionDollars) }
});
```

---

## Comparing Options:

| Feature | Google Analytics | Plausible | Simple Analytics | Cloudflare |
|---------|-----------------|-----------|------------------|------------|
| **Cost** | Free | $9/mo | $19/mo | Free |
| **Privacy** | ⚠️ Moderate | ✅ High | ✅ High | ✅ High |
| **Setup** | Easy | Easy | Easy | Moderate |
| **Features** | Advanced | Simple | Simple | Basic |
| **Geographic Data** | ✅ Detailed | ✅ Good | ✅ Good | ✅ Basic |
| **Real-time** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Delayed |
| **Cookies** | ✅ Yes | ❌ No | ❌ No | ❌ No |

---

## Recommendation for Your Project:

**For Educational/Portfolio:** Use **Google Analytics 4** (free, full-featured)  
**For Privacy-Conscious:** Use **Plausible** (30-day trial to test)  
**For Long-term Free:** Consider **Cloudflare Pages** (requires migration)

---

## After Adding Analytics:

1. **Add Privacy Policy** (see PRIVACY-POLICY.md)
2. **Update README** to mention analytics
3. **Consider cookie consent** (if using GA4)
4. **Monitor regularly** to see visitor patterns

---

## Testing Your Analytics:

1. Deploy the updated site
2. Visit your site in an incognito window
3. Wait 5-10 minutes
4. Check your analytics dashboard
5. You should see your visit registered!

---

## Geographic Data You'll See:

- **Country**: United States, India, Germany, etc.
- **Region/State**: California, New York, Texas, etc.
- **City**: San Francisco, Los Angeles, New York, etc.
- **Coordinates**: Approximate latitude/longitude
- **Language**: en-US, es, fr, etc.
- **Time zone**: PST, EST, etc.

---

## Need Help?

- Google Analytics Help: [support.google.com/analytics](https://support.google.com/analytics)
- Plausible Docs: [plausible.io/docs](https://plausible.io/docs)
- Simple Analytics Docs: [docs.simpleanalytics.com](https://docs.simpleanalytics.com)

