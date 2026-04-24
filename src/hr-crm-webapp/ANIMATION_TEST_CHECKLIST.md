# Animation Test Checklist

## How to Test Animations

### 1. Start the Application

```bash
cd src/hr-crm-webapp
npm start
```

Wait for the server to start, then open http://localhost:4200

### 2. Test Each Page

#### ✅ Dashboard (`/home/dashboard`)

**Expected Animations:**
- [ ] Hero section fades in
- [ ] Metric cards appear one by one (staggered)
- [ ] Numbers count up from 0 to target value
- [ ] Chart bars grow from bottom to top
- [ ] Cards lift on hover
- [ ] Buttons lift on hover

**How to Test:**
1. Navigate to `/home/dashboard`
2. Watch the page load
3. Hover over metric cards
4. Hover over buttons
5. Scroll down to see more animations

---

#### ✅ Employees (`/hr/employees`)

**Expected Animations:**
- [ ] Page container fades in
- [ ] Header section appears
- [ ] Filter section slides in
- [ ] Employee cards appear with stagger
- [ ] Cards lift on hover
- [ ] Buttons lift on hover

**How to Test:**
1. Navigate to `/hr/employees`
2. Watch the page load
3. Hover over employee cards
4. Click "Add Employee" button
5. Observe smooth transitions

---

#### ✅ Leave Requests (`/hr/leave-requests`)

**Expected Animations:**
- [ ] Page fades in
- [ ] Header appears
- [ ] Request cards appear with stagger
- [ ] Cards lift on hover
- [ ] List items slide in

**How to Test:**
1. Navigate to `/hr/leave-requests`
2. Watch cards appear
3. Hover over request cards
4. Scroll to see more items

---

#### ✅ Payroll (`/hr/payroll`)

**Expected Animations:**
- [ ] Page fades in
- [ ] Summary cards appear with stagger
- [ ] Table rows fade in one by one
- [ ] Cards lift on hover
- [ ] Buttons respond to hover

**How to Test:**
1. Navigate to `/hr/payroll`
2. Watch summary cards appear
3. Scroll to table
4. Hover over cards and buttons

---

#### ✅ Attendance (`/hr/attendance`)

**Expected Animations:**
- [ ] Page fades in
- [ ] Header appears
- [ ] Filter controls animate
- [ ] Table rows appear with stagger
- [ ] Interactive elements respond

**How to Test:**
1. Navigate to `/hr/attendance`
2. Watch page load
3. Interact with filters
4. Observe table animations

---

#### ✅ Job Openings (`/recruitment/job-openings`)

**Expected Animations:**
- [ ] Page fades in
- [ ] Job cards appear with stagger
- [ ] Cards lift on hover
- [ ] Buttons animate on hover

**How to Test:**
1. Navigate to `/recruitment/job-openings`
2. Watch cards appear
3. Hover over job cards

---

#### ✅ Candidates (`/recruitment/candidates`)

**Expected Animations:**
- [ ] Page fades in
- [ ] Candidate cards stagger in
- [ ] Cards lift on hover
- [ ] Smooth transitions

**How to Test:**
1. Navigate to `/recruitment/candidates`
2. Watch animations
3. Hover over cards

---

### 3. Test Interactive Elements

#### Buttons
- [ ] Lift 2px on hover
- [ ] Shadow appears on hover
- [ ] Press down on click
- [ ] Smooth transitions

**How to Test:**
Hover and click any button on any page

---

#### Cards
- [ ] Lift 4px on hover
- [ ] Shadow increases on hover
- [ ] Smooth transition
- [ ] Returns to normal on mouse leave

**How to Test:**
Hover over any card on any page

---

#### Inputs
- [ ] Lift slightly on focus
- [ ] Border color changes
- [ ] Smooth transition
- [ ] Shadow appears

**How to Test:**
Click into any input field

---

#### Tables
- [ ] Rows fade in one by one
- [ ] 30ms delay between rows
- [ ] Smooth appearance

**How to Test:**
Navigate to any page with a table

---

### 4. Test Reduced Motion

#### Enable Reduced Motion

**Windows:**
1. Settings → Accessibility
2. Visual effects → Animation effects
3. Turn OFF

**macOS:**
1. System Preferences → Accessibility
2. Display → Reduce motion
3. Check the box

**Browser DevTools:**
1. Open DevTools (F12)
2. Click three dots → More tools → Rendering
3. Find "Emulate CSS media feature prefers-reduced-motion"
4. Select "prefers-reduced-motion: reduce"

#### Expected Behavior
- [ ] All animations become instant
- [ ] No motion/transitions
- [ ] Page still functions normally
- [ ] Content appears immediately

---

### 5. Performance Check

#### Open DevTools Performance Tab
1. Press F12
2. Go to Performance tab
3. Click Record
4. Navigate between pages
5. Stop recording

#### Expected Metrics
- [ ] 60 FPS during animations
- [ ] No layout thrashing
- [ ] Smooth frame rate
- [ ] No jank or stuttering

---

### 6. Visual Inspection

#### Typography
- [ ] All headings use Black Han Sans
- [ ] All body text uses Noto Sans
- [ ] Consistent font weights
- [ ] Proper letter spacing
- [ ] Responsive sizing

**How to Test:**
1. Right-click any heading → Inspect
2. Check Computed styles
3. Verify font-family: 'Black Han Sans'

---

### 7. Cross-Browser Testing

Test in multiple browsers:

#### Chrome
- [ ] All animations work
- [ ] Smooth performance
- [ ] No visual glitches

#### Firefox
- [ ] All animations work
- [ ] Smooth performance
- [ ] No visual glitches

#### Edge
- [ ] All animations work
- [ ] Smooth performance
- [ ] No visual glitches

#### Safari (if available)
- [ ] All animations work
- [ ] Smooth performance
- [ ] No visual glitches

---

### 8. Mobile Responsiveness

#### Test on Mobile Viewport
1. Open DevTools (F12)
2. Click device toolbar icon
3. Select mobile device
4. Test animations

**Expected:**
- [ ] Animations still work
- [ ] Performance is good
- [ ] Touch interactions smooth
- [ ] No layout issues

---

## Common Issues & Solutions

### Issue: Animations not visible

**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check DevTools Console for errors
4. Verify `app-animations.css` is loaded in Network tab

---

### Issue: Animations too slow

**Solution:**
Edit `src/styles.css`:
```css
--animation-duration-normal: 200ms; /* was 300ms */
```

---

### Issue: Animations too fast

**Solution:**
Edit `src/styles.css`:
```css
--animation-duration-normal: 400ms; /* was 300ms */
```

---

### Issue: Some elements don't animate

**Solution:**
Check if element has matching class pattern:
- Must contain: `-card`, `-item`, `-grid`, `-list`, etc.
- Or add manual class: `animate-fade-in-up`

---

## Success Criteria

✅ All pages fade in smoothly
✅ Cards appear with stagger effect
✅ Lists slide in from left
✅ Buttons lift on hover
✅ Cards lift on hover
✅ Inputs respond to focus
✅ Tables animate row by row
✅ Reduced motion works
✅ 60 FPS performance
✅ No console errors
✅ Typography is consistent
✅ Works in all browsers

---

## Final Verification

After testing all items above, the animation system is:

- [ ] **Functional**: All animations work as expected
- [ ] **Performant**: 60 FPS, no jank
- [ ] **Accessible**: Reduced motion support works
- [ ] **Consistent**: Same behavior across pages
- [ ] **Responsive**: Works on all screen sizes
- [ ] **Cross-browser**: Works in all major browsers

---

## Report Issues

If you find any issues:

1. Note the page URL
2. Describe expected vs actual behavior
3. Include browser and OS version
4. Check browser console for errors
5. Take a screenshot if possible

---

## Conclusion

If all checkboxes are marked, the animation system is **fully functional and production-ready**! 🎉
