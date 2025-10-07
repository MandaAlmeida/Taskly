import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  
  backButton: {
    padding: 8,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  
  placeholder: {
    width: 40,
  },
  
  scrollContainer: {
    flex: 1,
  },
  
  // Informações do App
  appInfoSection: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  appLogo: {
    marginBottom: 16,
  },
  
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  
  appVersion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  
  appDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Seções
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  
  // Recursos
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  featureText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 12,
  },
  
  // Desenvolvedores
  developerItem: {
    marginBottom: 12,
  },
  
  developerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  
  developerName: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  
  // Links
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  linkText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 12,
    flex: 1,
  },
  
  // Agradecimentos
  thanksText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  
  // Copyright
  copyrightSection: {
    alignItems: 'center',
    padding: 20,
    marginTop: 16,
  },
  
  copyrightText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
