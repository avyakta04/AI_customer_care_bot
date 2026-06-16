import os
import joblib

class ResponseEngine:
    def __init__(self, models_dir):
        self.models_dir = models_dir
        
        # Responses logic matrix based on Intent & Emotion
        self.response_matrix = {
            "payment_issue": {
                "angry": "I completely understand your frustration regarding this billing issue. I have immediately issued a full refund and flagged your account for priority review.",
                "confused": "I understand billing can be confusing. Let me break down the charges on your recent invoice.",
                "neutral": "Your payment issue has been logged. Our finance team will resolve it within 24 hours."
            },
            "technical_support": {
                "angry": "This outage is unacceptable, and I apologize for the disruption. Our Tier 3 engineers are rebooting the cluster right now.",
                "confused": "It looks like there might be a configuration mismatch. Let's walk through the setup process together.",
                "neutral": "I've run a diagnostic on your system. Everything appears to be functioning normally. Please try clearing your cache."
            },
            "order_tracking": {
                "angry": "I apologize for the severe delay with your order. I have upgraded your shipping to overnight express at no additional cost.",
                "neutral": "Your order is currently in transit. You can expect delivery by tomorrow evening."
            },
            "cancellation": {
                "angry": "I am so sorry to hear you're leaving under these circumstances. I have canceled your account and waived the final month's fee.",
                "neutral": "Your cancellation request has been successfully processed. You will have access until the end of the billing cycle."
            },
            "default": "I understand your concern. I have escalated this ticket to our specialized support team who will contact you shortly."
        }

    def generate_response(self, intent, emotion, urgency, memories):
        """
        Hybrid Generation:
        1. If FAISS memory has a high confidence match (>90), use the memory snippet.
        2. Else, use the Intent+Emotion matrix.
        3. Prepend/Append urgency indicators.
        """
        
        # 1. Check FAISS memories for exact historical matches
        if memories and len(memories) > 0:
            top_memory = memories[0]
            if top_memory.get("similarity", 0) > 90.0:
                return f"[Recalling previous resolution]: {top_memory['snippet']}"
                
        # 2. Template Generation
        intent_category = self.response_matrix.get(intent, None)
        if intent_category:
            base_response = intent_category.get(emotion, intent_category.get("neutral", self.response_matrix["default"]))
        else:
            base_response = self.response_matrix["default"]
            
        # 3. Apply Urgency Modifiers
        if urgency in ["high", "critical"]:
            base_response = "[PRIORITY ESCALATION ACTIVE] " + base_response + " A human supervisor has been notified."
            
        return base_response
