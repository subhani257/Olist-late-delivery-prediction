import sys
import os

def create_presentation():
    try:
        import pptx
        from pptx.util import Inches, Pt
        from pptx.dml.color import RGBColor
        from pptx.enum.text import PP_ALIGN
        from pptx.enum.shapes import MSO_SHAPE
    except ImportError:
        print("python-pptx not installed yet. Please run pip install python-pptx")
        sys.exit(1)

    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    DARK_BG = RGBColor(11, 15, 25)
    CARD_BG = RGBColor(21, 28, 44)
    TEXT_LIGHT = RGBColor(248, 250, 252)
    TEXT_MUTED = RGBColor(148, 163, 184)
    ACCENT_CYAN = RGBColor(6, 182, 212)
    ACCENT_INDIGO = RGBColor(99, 102, 241)
    RISK_HIGH = RGBColor(239, 68, 68)
    RISK_LOW = RGBColor(16, 185, 129)
    RISK_MED = RGBColor(245, 158, 11)

    def set_bg(slide):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = DARK_BG

    def add_header(slide, tag_text, title_text):
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
        tf_tag = tb_tag.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = ACCENT_CYAN
        p_tag.font.name = 'Outfit'

        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.8))
        tf_title = tb_title.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_LIGHT
        p_title.font.name = 'Outfit'

    def add_card(slide, left, top, width, height, bg_color=CARD_BG):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = RGBColor(255, 255, 255)
        shape.line.width = Pt(0.5)
        return shape

    speaker_notes = {
        1: "Good morning/afternoon. Today we present our Data Mining solution for Olist E-commerce: an early-warning system that flags high-risk delivery delays at the exact second an order is placed.",
        2: "Over 8% of Olist orders arrive late, causing a catastrophic drop in review scores from 4.15 down to 2.25. The delays are disproportionately high over long distances and regional hubs.",
        3: "Our model empowers operations, sellers, and support teams to transition from reactive firefighting to proactive delay management.",
        4: "We unified 9 distinct relational tables into 96,470 validated orders, generating 67 predictive features without introducing post-checkout data leakage.",
        5: "EDA reveals clear structural patterns: Northeast deliveries and long-haul distances (>1500 km) double the risk of late arrival, exacerbated by holiday volume surges.",
        6: "We engineered 67 signals like Haversine distance and freight ratios, while strictly splitting data chronologically to ensure realistic model evaluation.",
        7: "Our architecture transforms raw checkout attributes through a neural model to output instant risk classifications.",
        8: "The Neural Network achieved the highest PR-AUC of 0.1773. On unseen test orders, it successfully flags 1 out of 4 late orders before they even ship.",
        9: "Distance, tight delivery windows, and freight-to-price ratios are the top predictors driving delay risk in our model.",
        10: "Here is our live system in action. By inputting order specs, the system instantly outputs a color-coded risk badge and actionable intervention steps.",
        11: "We recommend a 3-tier operational response: High-risk orders trigger priority shipping and proactive messaging, drastically cutting customer dissatisfaction.",
        12: "While highly effective, the model relies on historical data. Integrating real-time weather and carrier APIs will be our next phase.",
        13: "In conclusion, early risk detection turns potential delivery failures into customer touchpoints. Thank you, and we welcome your questions!"
    }

    # SLIDE 1: Title
    s1 = prs.slides.add_slide(blank_layout); set_bg(s1)
    tb = s1.shapes.add_textbox(Inches(1.5), Inches(1.8), Inches(10.33), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "📦 OLIST LOGISTICS INTELLIGENCE"; p.font.size = Pt(14); p.font.bold = True; p.font.color.rgb = ACCENT_CYAN; p.alignment = PP_ALIGN.CENTER
    p2 = tf.add_paragraph(); p2.text = "Late Delivery Early Warning System"; p2.font.size = Pt(38); p2.font.bold = True; p2.font.color.rgb = TEXT_LIGHT; p2.alignment = PP_ALIGN.CENTER
    p3 = tf.add_paragraph(); p3.text = "Predicting Order Delays at Checkout to Safeguard Customer CSAT & Operational Revenue"; p3.font.size = Pt(18); p3.font.color.rgb = TEXT_MUTED; p3.alignment = PP_ALIGN.CENTER
    p4 = tf.add_paragraph(); p4.text = "\nModule: IT3051 Fundamentals of Data Mining  |  Dataset Scope: 96,470 Orders"; p4.font.size = Pt(14); p4.font.color.rgb = ACCENT_INDIGO; p4.alignment = PP_ALIGN.CENTER
    s1.notes_slide.notes_text_frame.text = speaker_notes[1]

    # SLIDE 2: Business Problem
    s2 = prs.slides.add_slide(blank_layout); set_bg(s2)
    add_header(s2, "Slide 02 — Problem Size & CSAT Impact", "1 in 12 Orders Arrives Late — Crushing Customer Trust")
    add_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "🚨 Key Problem Metrics:"; p.font.size = Pt(20); p.font.bold = True; p.font.color.rgb = RISK_HIGH
    items2 = [
        ("8.1% Overall Late Rate:", " 7,826 of 96,470 orders arrived past promised date."),
        ("Regional Disparity:", " Northeast late rate reaches 14.3% vs 7.1% in South."),
        ("Distance Spike:", " Orders >1,500 km have a 13.1% delay rate."),
        ("CSAT Collapse:", " Average review score drops from 4.15 ⭐ to 2.25 ⭐.")
    ]
    for k, v in items2:
        p_b = tf.add_paragraph(); p_b.font.size = Pt(14)
        r1 = p_b.add_run(); r1.text = "• " + k; r1.font.bold = True; r1.font.color.rgb = ACCENT_CYAN
        r2 = p_b.add_run(); r2.text = v; r2.font.color.rgb = TEXT_LIGHT

    # Right Card (Summary Stats)
    add_card(s2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb = s2.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "📊 Customer Satisfaction Impact:"; p.font.size = Pt(20); p.font.bold = True; p.font.color.rgb = ACCENT_INDIGO
    p2 = tf.add_paragraph(); p2.text = "\nOn-Time Orders CSAT:"; p2.font.size = Pt(16); p2.font.color.rgb = TEXT_MUTED
    p3 = tf.add_paragraph(); p3.text = "4.15 / 5.0 ⭐ (88,644 Orders)"; p3.font.size = Pt(24); p3.font.bold = True; p3.font.color.rgb = RISK_LOW
    p4 = tf.add_paragraph(); p4.text = "\nLate Orders CSAT:"; p4.font.size = Pt(16); p4.font.color.rgb = TEXT_MUTED
    p5 = tf.add_paragraph(); p5.text = "2.25 / 5.0 ⭐ (7,826 Orders) <-- 46% CSAT DROP!"; p5.font.size = Pt(24); p5.font.bold = True; p5.font.color.rgb = RISK_HIGH
    s2.notes_slide.notes_text_frame.text = speaker_notes[2]

    # SLIDE 3: Objective & Stakeholders
    s3 = prs.slides.add_slide(blank_layout); set_bg(s3)
    add_header(s3, "Slide 03 — Operational Scope", "Predict Risk at Order Time to Empower Stakeholders")
    quads = [
        ("🏬 Olist Operations", "Pain Point: Unseen bottleneck delays.\nAction: Automatically route high-risk shipments to express fulfillment.", Inches(0.8), Inches(1.8), ACCENT_CYAN),
        ("🏷️ Marketplace Sellers", "Pain Point: Bad reviews & seller penalties.\nAction: Dispatch high-risk packages with priority handling.", Inches(6.8), Inches(1.8), ACCENT_INDIGO),
        ("🎧 Customer Support", "Pain Point: Inundated with WISMO tickets.\nAction: Send proactive status updates before complaints occur.", Inches(0.8), Inches(4.4), RISK_MED),
        ("👤 End Customers", "Pain Point: Unrealistic delivery promises.\nAction: Receive transparent, realistic delivery timeframes.", Inches(6.8), Inches(4.4), RISK_LOW),
    ]
    for q_title, q_body, left, top, color in quads:
        add_card(s3, left, top, Inches(5.7), Inches(2.3))
        tb = s3.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), Inches(5.3), Inches(1.9))
        tf = tb.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]; p.text = q_title; p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = color
        p2 = tf.add_paragraph(); p2.text = q_body; p2.font.size = Pt(13); p2.font.color.rgb = TEXT_LIGHT
    s3.notes_slide.notes_text_frame.text = speaker_notes[3]

    # SLIDE 4: Data Architecture
    s4 = prs.slides.add_slide(blank_layout); set_bg(s4)
    add_header(s4, "Slide 04 — Data Architecture", "96,470 Orders Integrated Across 9 Datasets")
    add_card(s4, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    tb = s4.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(11.1), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "🌺 Integration & Data Scope Overview"; p.font.size = Pt(20); p.font.bold = True; p.font.color.rgb = ACCENT_CYAN
    items4 = [
        ("Official Source:", " Olist Public E-Commerce Dataset (Kaggle), 2016–2018."),
        ("Preserved Scope:", " 96,470 orders merged across 9 relational CSV files."),
        ("Engineered Signals:", " 67 signals created (Haversine distance, freight ratio, approval lag, customer state risk)."),
        ("Leakage Exclusion:", " Post-checkout fields (carrier pickup dates, actual delivery, review text) strictly omitted.")
    ]
    for k, v in items4:
        p_b = tf.add_paragraph(); p_b.font.size = Pt(15)
        r1 = p_b.add_run(); r1.text = "• " + k; r1.font.bold = True; r1.font.color.rgb = ACCENT_INDIGO
        r2 = p_b.add_run(); r2.text = v; r2.font.color.rgb = TEXT_LIGHT
    s4.notes_slide.notes_text_frame.text = speaker_notes[4]

    # SLIDE 5: Key Findings (EDA)
    s5 = prs.slides.add_slide(blank_layout); set_bg(s5)
    add_header(s5, "Slide 05 — Geographic & Distance Insights", "Where & When Delays Happen")
    add_card(s5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb = s5.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "🗺️ Late Rate by Region:"; p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = ACCENT_CYAN
    regions = [("Northeast", "14.3% (Highest Risk)"), ("North", "12.5%"), ("Central-West", "9.2%"), ("Southeast", "7.3%"), ("South", "7.1% (Lowest Risk)")]
    for r_name, r_rate in regions:
        p_b = tf.add_paragraph(); p_b.font.size = Pt(14)
        p_b.text = f"• {r_name}: {r_rate}"
        p_b.font.color.rgb = RISK_HIGH if "14" in r_rate or "12" in r_rate else TEXT_LIGHT

    add_card(s5, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb = s5.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "🚚 Late Rate by Shipping Distance:"; p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = ACCENT_INDIGO
    dists = [("< 250 km", "6.3%"), ("250 - 500 km", "7.2%"), ("500 - 1000 km", "8.8%"), ("1500+ km", "13.1% (Double Risk!)")]
    for d_range, d_rate in dists:
        p_b = tf.add_paragraph(); p_b.font.size = Pt(14)
        p_b.text = f"• {d_range}: {d_rate}"
        p_b.font.color.rgb = TEXT_LIGHT
    s5.notes_slide.notes_text_frame.text = speaker_notes[5]

    # SLIDE 6: Data Preparation
    s6 = prs.slides.add_slide(blank_layout); set_bg(s6)
    add_header(s6, "Slide 06 — Feature Pipeline", "Turning Raw Noise into Clean Predictive Signals")
    steps = [
        ("1. Clean & Geolocate", "• 19,015 ZIP prefixes median centroids.\n• Haversine Distance (km) seller-to-customer.\n• State-to-region mapping.", Inches(0.8), ACCENT_CYAN),
        ("2. Feature Engineering", "• freight_to_price_ratio signal.\n• estimated_delivery_days window.\n• approval_lag_hours processing time.", Inches(4.8), ACCENT_INDIGO),
        ("3. Time-Series Split", "• Chronological split (no random shuffle).\n• Train: 70% (67,529 orders)\n• Val: 15% (14,470) | Test: 15% (14,471)", Inches(8.8), RISK_LOW),
    ]
    for st_title, st_body, left, color in steps:
        add_card(s6, left, Inches(1.8), Inches(3.7), Inches(5.0))
        tb = s6.shapes.add_textbox(left + Inches(0.2), Inches(2.0), Inches(3.3), Inches(4.5))
        tf = tb.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]; p.text = st_title; p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = color
        p2 = tf.add_paragraph(); p2.text = st_body; p2.font.size = Pt(13); p2.font.color.rgb = TEXT_LIGHT
    s6.notes_slide.notes_text_frame.text = speaker_notes[6]

    # SLIDE 7: Solution Architecture
    s7 = prs.slides.add_slide(blank_layout); set_bg(s7)
    add_header(s7, "Slide 07 — ML Pipeline", "End-to-End Machine Learning Pipeline")
    add_card(s7, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    tb = s7.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(11.1), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "⚙️ 4-Stage Predictive Flow:"; p.font.size = Pt(20); p.font.bold = True; p.font.color.rgb = ACCENT_CYAN
    stages = [
        ("Stage 1 — Ingest:", " Order specs at checkout (ZIPs, freight, price, promise date)."),
        ("Stage 2 — Transform:", " Haversine distance, standard scaling & target encoding."),
        ("Stage 3 — Predict:", " Deep Neural Network (MLP) inference model."),
        ("Stage 4 — Action:", " Risk Score Badge (🟢 Low | 🟡 Medium | 🔴 High).")
    ]
    for k, v in stages:
        p_b = tf.add_paragraph(); p_b.font.size = Pt(15)
        r1 = p_b.add_run(); r1.text = "• " + k; r1.font.bold = True; r1.font.color.rgb = ACCENT_INDIGO
        r2 = p_b.add_run(); r2.text = v; r2.font.color.rgb = TEXT_LIGHT
    s7.notes_slide.notes_text_frame.text = speaker_notes[7]

    # SLIDE 8: Model Results
    s8 = prs.slides.add_slide(blank_layout); set_bg(s8)
    add_header(s8, "Slide 08 — Benchmark & Results", "Evaluating the 4 Contenders")
    add_card(s8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb = s8.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "🏆 Model Benchmarking (Val Set):"; p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = ACCENT_CYAN
    models = [("Neural Net (MLP)", "PR-AUC: 0.1773 ⭐ Champion"), ("Logistic Regression", "PR-AUC: 0.1606"), ("LightGBM", "PR-AUC: 0.1508"), ("Random Forest", "PR-AUC: 0.1505")]
    for m_name, m_score in models:
        p_b = tf.add_paragraph(); p_b.font.size = Pt(14)
        p_b.text = f"• {m_name}: {m_score}"
        p_b.font.color.rgb = RISK_LOW if "Champion" in m_score else TEXT_LIGHT

    add_card(s8, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb = s8.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "📊 Confusion Matrix (14,471 Test Orders):"; p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = ACCENT_INDIGO
    p2 = tf.add_paragraph(); p2.text = "• True Negatives (On-time): 11,110"; p2.font.size = Pt(14); p2.font.color.rgb = TEXT_LIGHT
    p3 = tf.add_paragraph(); p3.text = "• False Positives (False Alarms): 2,404"; p3.font.size = Pt(14); p3.font.color.rgb = RISK_MED
    p4 = tf.add_paragraph(); p4.text = "• False Negatives (Missed): 709"; p4.font.size = Pt(14); p4.font.color.rgb = RISK_HIGH
    p5 = tf.add_paragraph(); p5.text = "• True Positives (CAUGHT LATE!): 248"; p5.font.size = Pt(16); p5.font.bold = True; p5.font.color.rgb = RISK_LOW
    s8.notes_slide.notes_text_frame.text = speaker_notes[8]

    # SLIDE 9: What Drives Delays
    s9 = prs.slides.add_slide(blank_layout); set_bg(s9)
    add_header(s9, "Slide 09 — Delay Drivers", "Top 10 Delay Drivers Identified by Model")
    add_card(s9, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    tb = s9.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(11.1), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "🔑 Top Feature Importances:"; p.font.size = Pt(20); p.font.bold = True; p.font.color.rgb = ACCENT_CYAN
    feats = [
        ("1. Haversine Distance (km):", " #1 single determinant of delay failure."),
        ("2. Promised Delivery Days Window:", " Tight estimated windows leave zero logistics buffer."),
        ("3. Freight-to-Price Ratio:", " High relative freight reflects bulky/complex cargo handling."),
        ("4. Customer State Risk Score:", " Target-encoded regional delay probability.")
    ]
    for k, v in feats:
        p_b = tf.add_paragraph(); p_b.font.size = Pt(15)
        r1 = p_b.add_run(); r1.text = "• " + k; r1.font.bold = True; r1.font.color.rgb = ACCENT_INDIGO
        r2 = p_b.add_run(); r2.text = v; r2.font.color.rgb = TEXT_LIGHT
    s9.notes_slide.notes_text_frame.text = speaker_notes[9]

    # SLIDE 10: System Demo
    s10 = prs.slides.add_slide(blank_layout); set_bg(s10)
    add_header(s10, "Slide 10 — System Demo", "Real-Time Order Risk Scoring Interface")
    add_card(s10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb = s10.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "🟢 Scenario 1: Low Risk"; p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = RISK_LOW
    p2 = tf.add_paragraph(); p2.text = "• SP Local Order (ZIP 01001)\n• Promised Window: 26 Days\n• Result: 12% Risk -> Standard Process"; p2.font.size = Pt(14); p2.font.color.rgb = TEXT_LIGHT

    add_card(s10, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb = s10.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "🔴 Scenario 2: High Risk"; p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = RISK_HIGH
    p2 = tf.add_paragraph(); p2.text = "• Manaus Order (ZIP 69000)\n• Promised Window: 7 Days (Tight!)\n• Result: 64% Risk -> Trigger Priority Dispatch"; p2.font.size = Pt(14); p2.font.color.rgb = TEXT_LIGHT
    s10.notes_slide.notes_text_frame.text = speaker_notes[10]

    # SLIDE 11: Business Recommendations
    s11 = prs.slides.add_slide(blank_layout); set_bg(s11)
    add_header(s11, "Slide 11 — Recommendations", "3-Tier Operational Strategy for Olist")
    add_card(s11, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    tb = s11.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(11.1), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "💡 3 Risk Tiers & Business Protocols:"; p.font.size = Pt(20); p.font.bold = True; p.font.color.rgb = ACCENT_CYAN
    recs = [
        ("🔴 High Risk (> 55%):", " Reroute to express carrier + Send proactive customer notice."),
        ("🟡 Medium Risk (30% - 55%):", " Priority 24h packing queue + Flag seller approval lag."),
        ("🟢 Low Risk (< 30%):", " Standard economic fulfillment flow (zero intervention cost).")
    ]
    for k, v in recs:
        p_b = tf.add_paragraph(); p_b.font.size = Pt(15)
        r1 = p_b.add_run(); r1.text = "• " + k; r1.font.bold = True; r1.font.color.rgb = ACCENT_INDIGO
        r2 = p_b.add_run(); r2.text = v; r2.font.color.rgb = TEXT_LIGHT
    s11.notes_slide.notes_text_frame.text = speaker_notes[11]

    # SLIDE 12: Limitations & Future Roadmap
    s12 = prs.slides.add_slide(blank_layout); set_bg(s12)
    add_header(s12, "Slide 12 — Boundaries & Next Steps", "Honest Boundaries & Continuous Improvement")
    add_card(s12, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb = s12.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "⚠️ Limitations:"; p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = RISK_HIGH
    p2 = tf.add_paragraph(); p2.text = "• Static 2016–2018 historical data.\n• 8.1% class imbalance limits precision."; p2.font.size = Pt(14); p2.font.color.rgb = TEXT_LIGHT

    add_card(s12, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb = s12.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.5))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "🔮 Future Roadmap:"; p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = ACCENT_CYAN
    p2 = tf.add_paragraph(); p2.text = "• Real-time weather & highway traffic APIs.\n• Live carrier 7-day rolling performance scoring."; p2.font.size = Pt(14); p2.font.color.rgb = TEXT_LIGHT
    s12.notes_slide.notes_text_frame.text = speaker_notes[12]

    # SLIDE 13: Conclusion & Q&A
    s13 = prs.slides.add_slide(blank_layout); set_bg(s13)
    add_header(s13, "Slide 13 — Conclusion", "Transforming Delivery Risks into Customer Trust")
    add_card(s13, Inches(1.5), Inches(1.8), Inches(10.33), Inches(5.0))
    tb = s13.shapes.add_textbox(Inches(1.8), Inches(2.2), Inches(9.7), Inches(4.2))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "🎉 Key Takeaways:"; p.font.size = Pt(22); p.font.bold = True; p.font.color.rgb = ACCENT_CYAN
    takes = [
        ("1. CSAT Protection:", " 8.1% of orders arrive late, causing a 46% drop in customer reviews."),
        ("2. High Precision Warning:", " Our Neural Network catches 26% of late orders right at checkout time."),
        ("3. Actionable Matrix:", " Proactive 3-tiered actions turn potential delivery failures into customer touchpoints.")
    ]
    for k, v in takes:
        p_b = tf.add_paragraph(); p_b.font.size = Pt(16)
        r1 = p_b.add_run(); r1.text = "• " + k; r1.font.bold = True; r1.font.color.rgb = ACCENT_INDIGO
        r2 = p_b.add_run(); r2.text = v; r2.font.color.rgb = TEXT_LIGHT

    p_qa = tf.add_paragraph()
    p_qa.text = "\nThank You!  |  Questions & Answers"
    p_qa.font.size = Pt(24); p_qa.font.bold = True; p_qa.font.color.rgb = RISK_LOW; p_qa.alignment = PP_ALIGN.CENTER
    s13.notes_slide.notes_text_frame.text = speaker_notes[13]

    output_path = os.path.join(os.path.dirname(__file__), "..", "Olist_Late_Delivery_Presentation.pptx")
    prs.save(output_path)
    print(f"Successfully generated 13-slide PowerPoint deck at {output_path}")

if __name__ == "__main__":
    create_presentation()
