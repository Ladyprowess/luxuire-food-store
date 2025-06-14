import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Calendar, Clock, Plus, X } from 'lucide-react-native';

const frequencyOptions = [
  { id: 'weekly', label: 'Weekly', description: 'Every week' },
  { id: 'biweekly', label: 'Bi-weekly', description: 'Every 2 weeks' },
  { id: 'monthly', label: 'Monthly', description: 'Every month' },
  { id: 'custom', label: 'Custom', description: 'Set your own schedule' },
];

const timeOptions = [
  { id: 'morning', label: 'Morning (8:00 AM)', time: '08:00' },
  { id: 'afternoon', label: 'Afternoon (2:00 PM)', time: '14:00' },
  { id: 'evening', label: 'Evening (6:00 PM)', time: '18:00' },
  { id: 'custom', label: 'Custom Time', time: '' },
];

export default function AIReminderScreen() {
  const [reminderItems, setReminderItems] = useState<string[]>(['']);
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [customFrequency, setCustomFrequency] = useState('');
  const [reminderName, setReminderName] = useState('');

  const addReminderItem = () => {
    setReminderItems([...reminderItems, '']);
  };

  const updateReminderItem = (index: number, value: string) => {
    const updated = [...reminderItems];
    updated[index] = value;
    setReminderItems(updated);
  };

  const removeReminderItem = (index: number) => {
    if (reminderItems.length > 1) {
      const updated = reminderItems.filter((_, i) => i !== index);
      setReminderItems(updated);
    }
  };

  const handleSaveReminder = () => {
    // Validation
    if (!reminderName.trim()) {
      Alert.alert('Error', 'Please enter a name for your reminder');
      return;
    }

    const validItems = reminderItems.filter(item => item.trim());
    if (validItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item to remind you about');
      return;
    }

    if (!selectedFrequency) {
      Alert.alert('Error', 'Please select how often you want to be reminded');
      return;
    }

    if (!selectedTime) {
      Alert.alert('Error', 'Please select what time you want to be reminded');
      return;
    }

    if (selectedFrequency === 'custom' && !customFrequency.trim()) {
      Alert.alert('Error', 'Please specify your custom frequency');
      return;
    }

    if (selectedTime === 'custom' && !customTime.trim()) {
      Alert.alert('Error', 'Please specify your custom time');
      return;
    }

    // Save reminder (in real app, this would save to backend/local storage)
    Alert.alert(
      'Reminder Set!',
      `Your "${reminderName}" reminder has been set successfully. You'll be notified to order ${validItems.join(', ')} ${getFrequencyText()}.`,
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const getFrequencyText = () => {
    if (selectedFrequency === 'custom') {
      return customFrequency;
    }
    return frequencyOptions.find(opt => opt.id === selectedFrequency)?.description || '';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Shopping Reminder</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <Bell size={48} color="#B3C33E" strokeWidth={2} />
          <Text style={styles.introTitle}>Set Smart Reminders</Text>
          <Text style={styles.introSubtitle}>
            Never run out of your essential foodstuffs again. Set personalized reminders for your regular shopping items.
          </Text>
        </View>

        {/* Reminder Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Weekly Groceries, Monthly Staples"
            value={reminderName}
            onChangeText={setReminderName}
            placeholderTextColor="#999999"
          />
        </View>

        {/* Items to Remind */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What should we remind you to order? *</Text>
          <Text style={styles.sectionDescription}>
            Add the foodstuffs you regularly need. You can add multiple items.
          </Text>
          
          {reminderItems.map((item, index) => (
            <View key={index} style={styles.itemInputContainer}>
              <TextInput
                style={styles.itemInput}
                placeholder="e.g., 2 bunches of Ugu, 1 derica of rice"
                value={item}
                onChangeText={(text) => updateReminderItem(index, text)}
                placeholderTextColor="#999999"
              />
              {reminderItems.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeItemButton}
                  onPress={() => removeReminderItem(index)}
                >
                  <X size={20} color="#FF4444" strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          <TouchableOpacity style={styles.addItemButton} onPress={addReminderItem}>
            <Plus size={16} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.addItemText}>Add Another Item</Text>
          </TouchableOpacity>
        </View>

        {/* Frequency */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>How often? *</Text>
          </View>
          
          {frequencyOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedFrequency === option.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedFrequency(option.id)}
            >
              <View style={styles.optionInfo}>
                <Text style={[
                  styles.optionLabel,
                  selectedFrequency === option.id && styles.optionLabelSelected
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedFrequency === option.id && styles.optionDescriptionSelected
                ]}>
                  {option.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedFrequency === option.id && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}

          {selectedFrequency === 'custom' && (
            <TextInput
              style={styles.input}
              placeholder="e.g., Every 3 days, Every 2 months"
              value={customFrequency}
              onChangeText={setCustomFrequency}
              placeholderTextColor="#999999"
            />
          )}
        </View>

        {/* Time */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>What time? *</Text>
          </View>
          
          {timeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedTime === option.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedTime(option.id)}
            >
              <Text style={[
                styles.optionLabel,
                selectedTime === option.id && styles.optionLabelSelected
              ]}>
                {option.label}
              </Text>
              <View style={[
                styles.radioButton,
                selectedTime === option.id && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}

          {selectedTime === 'custom' && (
            <TextInput
              style={styles.input}
              placeholder="e.g., 10:30 AM, 7:00 PM"
              value={customTime}
              onChangeText={setCustomTime}
              placeholderTextColor="#999999"
            />
          )}
        </View>

        {/* Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>• We'll send you a notification at your chosen time</Text>
          <Text style={styles.infoText}>• The reminder will include your specified items</Text>
          <Text style={styles.infoText}>• You can easily place an order directly from the notification</Text>
          <Text style={styles.infoText}>• You can modify or cancel reminders anytime</Text>
          <Text style={styles.infoText}>• Smart suggestions based on your order history</Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveReminder}>
          <Bell size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.saveButtonText}>Set Reminder</Text>
        </TouchableOpacity>
      </View>
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
  introSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  introTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  introSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginLeft: 8,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  removeItemButton: {
    marginLeft: 12,
    padding: 8,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7E6',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B3C33E',
    borderStyle: 'dashed',
  },
  addItemText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#7A9C2A',
    marginLeft: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#F0F7E6',
    borderColor: '#B3C33E',
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#7A9C2A',
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  optionDescriptionSelected: {
    color: '#7A9C2A',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  radioButtonSelected: {
    borderColor: '#B3C33E',
    backgroundColor: '#B3C33E',
  },
  infoCard: {
    backgroundColor: '#F0F7E6',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B3C33E',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#B3C33E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});