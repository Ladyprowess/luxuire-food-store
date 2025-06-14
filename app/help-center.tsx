import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Phone, Mail, MessageCircle, Globe, ChevronRight, CircleHelp as HelpCircle, Clock, MapPin, CreditCard } from 'lucide-react-native';

const faqData = [
  {
    question: 'How does Luxuire work?',
    answer: 'Luxuire connects you with local market agents who shop for fresh foodstuffs on your behalf. When you place an order, our agents go to the market, buy your items fresh, and deliver them to your doorstep.',
  },
  {
    question: 'What are the delivery fees?',
    answer: 'Delivery within Lagos is ₦2,000. Outside Lagos but within Nigeria is ₦4,000. For international deliveries, please contact us for custom pricing.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery typically takes 2-4 hours depending on your location and the items ordered. We provide real-time tracking so you know exactly when to expect your order.',
  },
  {
    question: 'Can I make special requests?',
    answer: 'Yes! You can add special requests for each item (like "wash and slice the vegetables") or general instructions for your entire order.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers, card payments via Paystack/Flutterwave, and USSD payments for your convenience.',
  },
  {
    question: 'What if an item is not available?',
    answer: 'Our agents will contact you immediately if any item is unavailable and suggest alternatives or remove it from your order with a refund.',
  },
];

const contactMethods = [
  {
    icon: Phone,
    title: 'Call Us',
    subtitle: '+234 902 711 3199',
    action: () => Linking.openURL('tel:+2349027113199'),
  },
  {
    icon: Mail,
    title: 'Email Support',
    subtitle: 'support@luxuire.com',
    action: () => Linking.openURL('mailto:support@luxuire.com?cc=admin@luxuire.com'),
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    subtitle: 'Chat with us on WhatsApp',
    action: () => Linking.openURL('https://wa.me/2349027113199'),
  },
  {
    icon: Globe,
    title: 'Website',
    subtitle: 'luxuire.com',
    action: () => Linking.openURL('https://luxuire.com'),
  },
];

export default function HelpCenterScreen() {
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleTrackOrder = () => {
    router.push('/(tabs)/orders');
  };

  const handleDeliveryInfo = () => {
    router.push('/location-picker');
  };

  const handlePaymentHelp = () => {
    Linking.openURL('mailto:luxuireng@gmail.com?cc=support@luxuire.com&subject=Payment Help Request&body=Hello Luxuire Support Team,%0D%0A%0D%0AI need assistance with payment-related issues.%0D%0A%0D%0APlease describe your payment issue below:%0D%0A%0D%0A');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <HelpCircle size={48} color="#B3C33E" strokeWidth={2} />
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeSubtitle}>
            Find answers to common questions or get in touch with our support team
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleTrackOrder}>
              <Clock size={24} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.quickActionText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleDeliveryInfo}>
              <MapPin size={24} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.quickActionText}>Delivery Address</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={handlePaymentHelp}>
              <CreditCard size={24} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.quickActionText}>Payment Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqData.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqCard}
              onPress={() => toggleFaq(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <ChevronRight 
                  size={20} 
                  color="#666666" 
                  strokeWidth={2}
                  style={[
                    styles.faqChevron,
                    expandedFaq === index && styles.faqChevronExpanded
                  ]}
                />
              </View>
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          {contactMethods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactCard}
              onPress={method.action}
            >
              <View style={styles.contactIcon}>
                <method.icon size={20} color="#B3C33E" strokeWidth={2} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
              </View>
              <ChevronRight size={20} color="#CCCCCC" strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Company Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          <View style={styles.companyCard}>
            <Text style={styles.companyName}>Luxuire</Text>
            <Text style={styles.companyDetail}>📧 info@luxuire.com</Text>
            <Text style={styles.companyDetail}>📍 Lagos, Nigeria</Text>
            <Text style={styles.companyDetail}>📞 +234 902 711 3199</Text>
            <Text style={styles.companyDetail}>🌐 luxuire.com</Text>
          </View>
        </View>

        {/* Business Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          <View style={styles.hoursCard}>
            <Clock size={20} color="#B3C33E" strokeWidth={2} />
            <View style={styles.hoursInfo}>
              <Text style={styles.hoursTitle}>Customer Support</Text>
              <Text style={styles.hoursText}>Monday - Sunday: 7:00 AM - 10:00 PM</Text>
              <Text style={styles.hoursText}>Market Shopping: 6:00 AM - 8:00 PM</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#333333',
    marginTop: 8,
    textAlign: 'center',
  },
  faqCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    flex: 1,
    marginRight: 12,
  },
  faqChevron: {
    transform: [{ rotate: '0deg' }],
  },
  faqChevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  faqAnswer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginTop: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  companyCard: {
    backgroundColor: '#F0F7E6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  companyName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#7A9C2A',
    marginBottom: 12,
  },
  companyDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    marginBottom: 6,
  },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F7E6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  hoursInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hoursTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginBottom: 8,
  },
  hoursText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});