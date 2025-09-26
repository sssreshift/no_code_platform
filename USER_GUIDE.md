# Reshift NoCode Platform - User Guide

## Welcome to Reshift NoCode Platform

Reshift NoCode Platform is a powerful visual application builder that allows you to create professional web applications without writing a single line of code. This guide will walk you through all the features and help you build your first application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Creating Your First App](#creating-your-first-app)
4. [Visual App Builder](#visual-app-builder)
5. [Component Library](#component-library)
6. [Data Sources](#data-sources)
7. [Publishing Apps](#publishing-apps)
8. [Advanced Features](#advanced-features)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Creating an Account

1. **Navigate to the Platform**: Go to `http://localhost:3000`
2. **Click "Register"**: Create a new account
3. **Fill in Your Details**:
   - Email address
   - Username (must be unique)
   - First and last name
   - Secure password
4. **Click "Create Account"**: You'll be automatically logged in

### First Login

1. **Enter Your Credentials**: Use the email and password you registered with
2. **Access Dashboard**: You'll be redirected to your personal dashboard
3. **Explore the Interface**: Familiarize yourself with the layout and navigation

## Dashboard Overview

The dashboard is your central hub for managing all your applications and data sources.

### Main Navigation

- **Dashboard**: Overview of all your applications
- **App Builder**: Visual application builder (accessed from individual apps)
- **Data Sources**: Manage your database and API connections
- **Settings**: Account and platform settings

### Dashboard Features

#### Application Cards
Each application is displayed as a card showing:
- **App Name**: The title of your application
- **Description**: Brief description of the app's purpose
- **Status**: Published (green) or Draft (orange)
- **URL Slug**: The public URL path for published apps
- **Last Updated**: When the app was last modified

#### Quick Actions
- **Create New App**: Start building a new application
- **Edit**: Open the app in the visual builder
- **Preview**: See how your app looks to users
- **Publish**: Make your app publicly accessible
- **Delete**: Remove the app permanently

#### Empty State
When you have no applications, you'll see:
- A welcoming message encouraging you to create your first app
- A prominent "Create Your First App" button
- Information about the platform's capabilities

## Creating Your First App

### Step 1: Create a New Application

1. **Click "Create New App"** on the dashboard
2. **Fill in App Details**:
   - **Name**: Give your app a descriptive name
   - **Description**: Explain what your app does
   - **URL Slug**: This will be your app's public URL (e.g., `my-awesome-app`)
3. **Click "Create App"**

### Step 2: Access the App Builder

1. **Click "Edit"** on your new app card
2. **You'll be taken to the Visual App Builder**
3. **Familiarize yourself with the interface**:
   - Left sidebar: Component palette
   - Center: Canvas area
   - Right sidebar: Properties panel (appears when you select a component)

## Visual App Builder

The Visual App Builder is where the magic happens. It's a drag-and-drop interface that makes building applications intuitive and fun.

### Interface Overview

#### Left Sidebar - Component Palette
- **Components Tab**: Browse and add components
- **Layers Tab**: View and manage your app's component hierarchy
- **Categories**: Components organized by type (Basic, Form, Layout, Data, etc.)

#### Center Canvas
- **Design Mode**: Edit and arrange components
- **Preview Mode**: See how your app looks to users
- **Grid System**: Visual grid to help with alignment
- **Component Selection**: Click components to select and edit them

#### Right Sidebar - Properties Panel
- **Component Properties**: Edit component-specific settings
- **Styling Options**: Customize colors, fonts, spacing
- **Events & Actions**: Set up interactions and behaviors
- **Data Binding**: Connect components to data sources

### Building Your App

#### Adding Components

1. **Browse the Component Palette**: Look through different categories
2. **Click a Component**: It will be added to your canvas
3. **Position the Component**: Drag it to your desired location
4. **Resize if Needed**: Use the corner handles to adjust size

#### Editing Components

1. **Select a Component**: Click on it in the canvas
2. **Properties Panel Opens**: Configure the component's properties
3. **Make Changes**: Update text, colors, sizes, etc.
4. **See Changes Instantly**: Updates appear in real-time

#### Component Categories

##### Basic Components
- **Text**: Headings, paragraphs, labels
- **Button**: Call-to-action buttons with various styles
- **Image**: Photos, logos, graphics
- **Divider**: Visual separators

##### Form Components
- **Input Field**: Text inputs, email, password fields
- **Text Area**: Multi-line text input
- **Select Dropdown**: Choose from predefined options
- **Checkbox**: Yes/no selections
- **Radio Button**: Single choice from multiple options

##### Layout Components
- **Container**: Group and organize other components
- **Card**: Content containers with headers and bodies
- **Grid**: Organize components in rows and columns
- **Flex Container**: Flexible layout arrangements

##### Data Components
- **Table**: Display tabular data
- **List**: Show data in list format
- **Chart**: Visualize data with graphs and charts

##### Navigation Components
- **Navigation Bar**: Main site navigation
- **Breadcrumb**: Show current page location
- **Pagination**: Navigate through multiple pages
- **Tabs**: Organize content in tabbed sections

##### Feedback Components
- **Alert**: Show important messages
- **Badge**: Small status indicators
- **Progress Bar**: Show completion status
- **Loading Spinner**: Indicate loading states

## Component Library

### Text Component

Perfect for headings, descriptions, and labels.

**Properties:**
- **Text Content**: What text to display
- **Typography Variant**: h1, h2, h3, body1, body2, caption
- **Color**: Text color
- **Alignment**: Left, center, right, justify

**Example Use Cases:**
- Page titles and headings
- Product descriptions
- Instructions and help text
- Labels for form fields

### Button Component

Interactive elements for user actions.

**Properties:**
- **Button Text**: The text displayed on the button
- **Variant**: Contained, outlined, or text style
- **Color**: Primary, secondary, success, error, warning
- **Size**: Small, medium, large
- **Disabled State**: Enable/disable the button

**Events:**
- **onClick**: Actions to perform when clicked
  - Show/hide components
  - Make API calls
  - Navigate to other pages
  - Show notifications

### Input Field Component

Collect user input and data.

**Properties:**
- **Label**: Field label
- **Placeholder**: Hint text when empty
- **Type**: Text, email, password, number, phone
- **Required**: Make the field mandatory
- **Disabled**: Prevent user input

**Events:**
- **onChange**: Actions when value changes
- **onSubmit**: Actions when form is submitted

### Table Component

Display structured data in rows and columns.

**Properties:**
- **Columns**: Define column headers
- **Data**: Provide the data to display
- **Show Headers**: Toggle column headers
- **Striped Rows**: Alternate row colors

**Data Binding:**
- Connect to database queries
- Display real-time data
- Auto-refresh capabilities

### Chart Component

Visualize data with various chart types.

**Chart Types:**
- **Bar Chart**: Compare values across categories
- **Line Chart**: Show trends over time
- **Pie Chart**: Show parts of a whole
- **Doughnut Chart**: Pie chart with center cutout

**Data Sources:**
- **Database Queries**: Connect to SQL databases
- **API Endpoints**: Fetch data from REST APIs
- **Static Data**: Use predefined data sets
- **Computed Data**: JavaScript expressions

**Properties:**
- **Chart Title**: Descriptive title
- **X-Axis Field**: Column for X-axis labels
- **Y-Axis Field**: Column for Y-axis values
- **Colors**: Customize chart colors
- **Auto-refresh**: Update data automatically

## Data Sources

Data sources connect your applications to external data, making them dynamic and powerful.

### Supported Data Source Types

#### Databases
- **MySQL**: Popular open-source database
- **PostgreSQL**: Advanced open-source database
- **MongoDB**: NoSQL document database

#### APIs
- **REST APIs**: Standard web service endpoints
- **GraphQL**: Flexible query language for APIs

#### Cloud Services
- **Redis**: In-memory data store
- **Google Sheets**: Spreadsheet data
- **AWS S3**: File storage

### Creating Data Sources

1. **Go to Data Sources**: Click "Data Sources" in the main navigation
2. **Click "Add Data Source"**
3. **Choose Type**: Select your data source type
4. **Configure Connection**:
   - **Database**: Host, port, database name, credentials
   - **API**: Base URL, authentication headers
   - **Cloud**: Service-specific configuration
5. **Test Connection**: Verify the connection works
6. **Save**: Store the data source configuration

### Database Configuration

#### MySQL/PostgreSQL
```
Host: localhost
Port: 3306 (MySQL) / 5432 (PostgreSQL)
Database: your_database_name
Username: your_username
Password: your_password
```

#### MongoDB
```
Host: localhost
Port: 27017
Database: your_database_name
Username: your_username
Password: your_password
Auth Source: admin
```

### API Configuration

#### REST API
```
Base URL: https://api.example.com
Headers:
  Authorization: Bearer your_token
  Content-Type: application/json
Timeout: 30 seconds
```

#### GraphQL
```
Endpoint: https://api.example.com/graphql
Headers:
  Authorization: Bearer your_token
Timeout: 30 seconds
```

### Using Data Sources in Components

#### Table with Database Data
1. **Add a Table Component**
2. **Configure Data Binding**:
   - Source: Database
   - Data Source: Select your database
   - Query: `SELECT * FROM users WHERE active = 1`
3. **Map Columns**: Define which database columns to display
4. **Test Query**: Verify the data loads correctly

#### Chart with API Data
1. **Add a Chart Component**
2. **Configure Data Binding**:
   - Source: API
   - Endpoint: `https://api.example.com/sales-data`
   - X-Axis: `month`
   - Y-Axis: `sales`
3. **Set Refresh Interval**: Auto-update every 5 minutes
4. **Customize Appearance**: Colors, title, labels

### Query Builder

For database connections, you can write SQL queries:

#### Basic Queries
```sql
-- Get all users
SELECT * FROM users;

-- Get active users only
SELECT id, name, email FROM users WHERE active = 1;

-- Get users with their order count
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
```

#### Parameterized Queries
```sql
-- Query with parameters
SELECT * FROM products WHERE category = :category AND price < :max_price;

-- Parameters: {"category": "electronics", "max_price": 1000}
```

## Publishing Apps

Once your app is ready, you can publish it to make it accessible to users.

### Publishing Process

1. **Save Your App**: Make sure all changes are saved
2. **Test in Preview**: Use preview mode to check everything works
3. **Click "Publish"**: On the dashboard, click the publish button
4. **Get Public URL**: Your app gets a public URL like `http://localhost:3001/your-app-slug`

### Published App Features

#### Public Access
- **No Authentication Required**: Anyone with the URL can access your app
- **Clean Interface**: No platform branding or navigation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Fast Loading**: Optimized for performance

#### Standalone Server
- **Separate Port**: Published apps run on port 3001
- **Independent**: Doesn't require the main platform to be running
- **Scalable**: Can be deployed separately for better performance

### Managing Published Apps

#### Unpublishing
- **Click "Unpublish"**: Remove public access
- **App Returns to Draft**: Can be edited and republished
- **URL Becomes Invalid**: Public URL no longer works

#### Updating Published Apps
1. **Edit Your App**: Make changes in the builder
2. **Save Changes**: Updates are saved to draft
3. **Republish**: Click publish again to update the public version
4. **Instant Updates**: Changes appear immediately on the public URL

## Advanced Features

### Event System

The event system allows components to interact with each other and perform actions.

#### Event Triggers
- **onClick**: When a button or clickable element is clicked
- **onChange**: When an input field value changes
- **onSubmit**: When a form is submitted

#### Available Actions

##### Show/Hide Components
- **Show Component**: Make a hidden component visible
- **Hide Component**: Hide a visible component
- **Use Case**: Progressive disclosure, conditional content

##### API Calls
- **Make API Request**: Send data to external services
- **Method**: GET, POST, PUT, DELETE
- **Headers**: Custom authentication and content headers
- **Data**: Send form data or JSON payloads

##### Database Queries
- **Execute Query**: Run SQL queries on connected databases
- **Parameters**: Use dynamic values in queries
- **Results**: Display query results in components

##### Navigation
- **Navigate to Page**: Move to different pages in your app
- **External Links**: Open external websites
- **Deep Linking**: Link to specific sections

##### Notifications
- **Show Message**: Display success, error, warning, or info messages
- **Custom Text**: Define your own notification content
- **Auto-dismiss**: Set automatic message removal

##### Variables
- **Set Variable**: Store values for later use
- **Global Scope**: Access variables across components
- **Dynamic Values**: Use variables in queries and API calls

### Data Binding

Connect components to live data sources for dynamic content.

#### Binding Types

##### Database Binding
```javascript
// SQL Query
SELECT name, email, created_at FROM users WHERE active = 1

// Auto-refresh every 5 minutes
refreshInterval: 300
```

##### API Binding
```javascript
// REST API endpoint
endpoint: "https://api.example.com/users"

// With authentication
headers: {
  "Authorization": "Bearer token"
}
```

##### Static Data
```javascript
// Predefined data
data: [
  {name: "John", age: 30},
  {name: "Jane", age: 25}
]
```

##### Computed Data
```javascript
// JavaScript expression
expression: "users.filter(u => u.age > 18).map(u => u.name)"
```

### Responsive Design

Your apps automatically adapt to different screen sizes.

#### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

#### Responsive Components
- **Grid System**: Components automatically reflow
- **Flexible Layouts**: Containers adapt to screen size
- **Touch-Friendly**: Buttons and inputs sized for mobile

### Custom Styling

Personalize your apps with custom CSS and styling.

#### Component Styling
- **Colors**: Background, text, border colors
- **Typography**: Font family, size, weight
- **Spacing**: Margins, padding, gaps
- **Borders**: Border radius, width, style
- **Shadows**: Box shadows for depth

#### Global Themes
- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Modern, eye-friendly design
- **Custom Colors**: Define your brand colors
- **Typography**: Choose font families

## Best Practices

### App Design

#### Planning Your App
1. **Define Purpose**: What problem does your app solve?
2. **Identify Users**: Who will use your app?
3. **Map User Journey**: How will users navigate through your app?
4. **List Features**: What functionality do you need?

#### User Experience
- **Keep It Simple**: Don't overwhelm users with too many options
- **Clear Navigation**: Make it easy to find information
- **Consistent Design**: Use similar components and styling
- **Mobile-First**: Design for mobile devices first

#### Performance
- **Optimize Images**: Use appropriate image sizes
- **Limit Data**: Only load necessary data
- **Efficient Queries**: Write optimized database queries
- **Cache Data**: Use auto-refresh judiciously

### Data Management

#### Database Design
- **Normalize Data**: Organize data efficiently
- **Use Indexes**: Speed up common queries
- **Validate Input**: Ensure data quality
- **Backup Regularly**: Protect your data

#### API Integration
- **Handle Errors**: Plan for API failures
- **Rate Limiting**: Respect API limits
- **Authentication**: Secure your API calls
- **Caching**: Reduce unnecessary requests

### Security

#### Data Protection
- **Validate Input**: Check all user inputs
- **Secure Connections**: Use HTTPS for data sources
- **Access Control**: Limit who can access your apps
- **Regular Updates**: Keep dependencies current

#### User Privacy
- **Minimal Data**: Only collect necessary information
- **Clear Policies**: Explain how you use data
- **User Control**: Let users manage their data
- **Secure Storage**: Protect sensitive information

## Troubleshooting

### Common Issues

#### App Won't Load
**Symptoms**: Blank screen or error message
**Solutions**:
- Check if the app is published
- Verify the URL is correct
- Clear browser cache
- Check browser console for errors

#### Components Not Displaying
**Symptoms**: Missing or broken components
**Solutions**:
- Check component properties
- Verify data binding configuration
- Test data source connections
- Review component visibility settings

#### Data Not Loading
**Symptoms**: Empty tables or charts
**Solutions**:
- Test data source connection
- Check SQL query syntax
- Verify API endpoint accessibility
- Review authentication credentials

#### Styling Issues
**Symptoms**: Components look wrong
**Solutions**:
- Check CSS syntax in custom styles
- Verify color values are valid
- Test responsive breakpoints
- Clear browser cache

### Getting Help

#### Documentation
- **User Guide**: This comprehensive guide
- **API Documentation**: Technical reference
- **Architecture Guide**: System overview
- **Video Tutorials**: Step-by-step walkthroughs

#### Support Channels
- **Email Support**: support@reshift.com
- **Community Forum**: GitHub Discussions
- **Bug Reports**: GitHub Issues
- **Feature Requests**: GitHub Discussions

#### Debugging Tools
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Monitor API requests
- **Preview Mode**: Test app functionality
- **Component Inspector**: Debug component properties

### Performance Optimization

#### Slow Loading Apps
**Causes**:
- Large images
- Inefficient queries
- Too many components
- Network latency

**Solutions**:
- Optimize image sizes
- Use pagination for large datasets
- Implement lazy loading
- Use CDN for static assets

#### Database Performance
**Causes**:
- Complex queries
- Missing indexes
- Large result sets
- Frequent queries

**Solutions**:
- Add database indexes
- Limit query results
- Use query caching
- Optimize SQL queries

## Conclusion

Congratulations! You now have a comprehensive understanding of the Reshift NoCode Platform. You can:

- ✅ Create and manage applications
- ✅ Build with the visual app builder
- ✅ Connect to data sources
- ✅ Publish professional apps
- ✅ Use advanced features like events and data binding

### Next Steps

1. **Build Your First App**: Start with a simple project
2. **Explore Components**: Try different component types
3. **Connect Data**: Add a database or API
4. **Publish and Share**: Make your app public
5. **Iterate and Improve**: Refine based on user feedback

### Resources

- **Platform**: http://localhost:3000
- **Published Apps**: http://localhost:3001
- **API Documentation**: http://localhost:8000/docs
- **Support**: support@reshift.com

Happy building! 🚀

