-- Punjab Traffic Police - AI Driving Test System Database Schema
-- Created for: Punjab Traffic Police Pakistan
-- Description: Complete database schema for AI-powered driving test administration system

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    cnic VARCHAR(15) UNIQUE NOT NULL, -- Pakistani CNIC format: 12345-1234567-1
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    profile_image_url VARCHAR(500),
    
    -- License Information
    existing_license_number VARCHAR(50),
    license_category ENUM('motorcycle', 'car', 'commercial', 'heavy') NOT NULL,
    
    -- System Fields
    status ENUM('active', 'inactive', 'suspended', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_cnic (cnic),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_license_category (license_category)
);

-- =====================================================
-- DRIVING TESTS TABLE
-- =====================================================
CREATE TABLE driving_tests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    test_number VARCHAR(20) UNIQUE NOT NULL, -- Format: PTP-2024-001234
    
    -- Test Scheduling
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    test_center VARCHAR(255) NOT NULL,
    examiner_id BIGINT,
    
    -- Test Execution
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    actual_duration_minutes INT NULL,
    
    -- Test Status
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    result ENUM('pass', 'fail', 'under_review') NULL,
    overall_score DECIMAL(5,2) NULL, -- Out of 100
    
    -- Test Images
    start_image_url VARCHAR(500) NULL,
    end_image_url VARCHAR(500) NULL,
    additional_images JSON NULL, -- Array of image URLs
    
    -- AI Analysis Results
    ai_analysis_data JSON NULL, -- Complete AI analysis results
    
    -- Failure Information
    failure_reason TEXT NULL,
    failure_category ENUM('speed_violation', 'traffic_rules', 'parking', 'signals', 'safety', 'technical', 'other') NULL,
    improvement_suggestions TEXT NULL,
    
    -- Metadata
    weather_conditions VARCHAR(100),
    traffic_conditions VARCHAR(100),
    vehicle_used VARCHAR(100),
    
    -- System Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_test_number (test_number),
    INDEX idx_status (status),
    INDEX idx_result (result),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_test_center (test_center)
);

-- =====================================================
-- TEST PHASES TABLE (Detailed test breakdown)
-- =====================================================
CREATE TABLE test_phases (
    id BIGSERIAL PRIMARY KEY,
    test_id BIGINT NOT NULL,
    phase_name VARCHAR(100) NOT NULL, -- e.g., 'Parallel Parking', 'Highway Driving', 'City Traffic'
    phase_order INT NOT NULL,
    
    -- Phase Execution
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    duration_minutes INT NULL,
    
    -- Phase Results
    status ENUM('pending', 'in_progress', 'completed', 'skipped', 'failed') DEFAULT 'pending',
    score DECIMAL(5,2) NULL, -- Out of 100
    max_speed_kmh DECIMAL(5,2) NULL,
    average_speed_kmh DECIMAL(5,2) NULL,
    
    -- AI Analysis for this phase
    ai_phase_data JSON NULL,
    violations JSON NULL, -- Array of violations detected
    
    -- Notes
    examiner_notes TEXT NULL,
    ai_recommendations TEXT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (test_id) REFERENCES driving_tests(id) ON DELETE CASCADE,
    INDEX idx_test_id (test_id),
    INDEX idx_phase_name (phase_name),
    INDEX idx_status (status)
);

-- =====================================================
-- USER TEST HISTORY (Track test attempts per user)
-- =====================================================
CREATE TABLE user_test_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_tests_taken INT DEFAULT 0,
    total_tests_passed INT DEFAULT 0,
    total_tests_failed INT DEFAULT 0,
    last_test_date DATE NULL,
    last_test_result ENUM('pass', 'fail', 'under_review') NULL,
    
    -- One-time test restriction
    can_retake BOOLEAN DEFAULT TRUE,
    retake_approved_by BIGINT NULL, -- Admin who approved retake
    retake_approved_at TIMESTAMP NULL,
    retake_reason TEXT NULL,
    
    -- Statistics
    best_score DECIMAL(5,2) NULL,
    average_score DECIMAL(5,2) NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (retake_approved_by) REFERENCES admin_users(id),
    UNIQUE KEY unique_user (user_id),
    INDEX idx_can_retake (can_retake),
    INDEX idx_last_test_date (last_test_date)
);

-- =====================================================
-- RETEST APPROVAL REQUESTS
-- =====================================================
CREATE TABLE retest_approval_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    previous_test_id BIGINT NOT NULL,
    
    -- Request Details
    request_reason TEXT NOT NULL,
    supporting_documents JSON NULL, -- URLs to uploaded documents
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Approval Process
    status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
    reviewed_by BIGINT NULL,
    reviewed_at TIMESTAMP NULL,
    review_comments TEXT NULL,
    
    -- Approval Decision
    approved_by BIGINT NULL,
    approved_at TIMESTAMP NULL,
    approval_comments TEXT NULL,
    rejection_reason TEXT NULL,
    
    -- New test details if approved
    new_test_scheduled BOOLEAN DEFAULT FALSE,
    new_test_id BIGINT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (previous_test_id) REFERENCES driving_tests(id),
    FOREIGN KEY (reviewed_by) REFERENCES admin_users(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (new_test_id) REFERENCES driving_tests(id),
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_requested_at (requested_at)
);

-- =====================================================
-- ADMIN USERS TABLE
-- =====================================================
CREATE TABLE admin_users (
    id BIGSERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL, -- PTP employee ID
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Role and Permissions
    role ENUM('super_admin', 'admin', 'examiner', 'operator', 'viewer') NOT NULL,
    permissions JSON NOT NULL, -- Detailed permissions array
    
    -- Department Info
    department VARCHAR(100) NOT NULL, -- e.g., 'Traffic Police', 'IT Department'
    designation VARCHAR(100) NOT NULL,
    reporting_manager_id BIGINT NULL,
    
    -- Authentication
    password_hash VARCHAR(255) NOT NULL,
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    account_locked BOOLEAN DEFAULT FALSE,
    
    -- Status
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reporting_manager_id) REFERENCES admin_users(id),
    INDEX idx_employee_id (employee_id),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- =====================================================
-- SYSTEM LOGS TABLE
-- =====================================================
CREATE TABLE system_logs (
    id BIGSERIAL PRIMARY KEY,
    log_type ENUM('user_action', 'system_event', 'error', 'security', 'test_event') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    
    -- Context
    user_id BIGINT NULL,
    admin_id BIGINT NULL,
    test_id BIGINT NULL,
    
    -- Log Data
    action VARCHAR(255) NOT NULL,
    description TEXT NULL,
    metadata JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    
    -- System Info
    server_name VARCHAR(100) NULL,
    response_time_ms INT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (admin_id) REFERENCES admin_users(id),
    FOREIGN KEY (test_id) REFERENCES driving_tests(id),
    
    INDEX idx_log_type (log_type),
    INDEX idx_severity (severity),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id),
    INDEX idx_admin_id (admin_id)
);

-- =====================================================
-- SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE system_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    category VARCHAR(50) NOT NULL, -- e.g., 'general', 'ai_config', 'test_rules'
    description TEXT NULL,
    
    -- Access Control
    is_public BOOLEAN DEFAULT FALSE, -- Can be read by non-admin users
    modified_by BIGINT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (modified_by) REFERENCES admin_users(id),
    INDEX idx_category (category),
    INDEX idx_setting_key (setting_key)
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_type ENUM('user', 'admin', 'all') NOT NULL,
    recipient_id BIGINT NULL, -- NULL for broadcast notifications
    
    -- Notification Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('info', 'success', 'warning', 'error', 'test_reminder', 'result') NOT NULL,
    
    -- Related Data
    related_test_id BIGINT NULL,
    related_request_id BIGINT NULL,
    
    -- Delivery Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    
    -- Channels
    sent_email BOOLEAN DEFAULT FALSE,
    sent_sms BOOLEAN DEFAULT FALSE,
    sent_push BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (related_test_id) REFERENCES driving_tests(id),
    FOREIGN KEY (related_request_id) REFERENCES retest_approval_requests(id),
    
    INDEX idx_recipient_type_id (recipient_type, recipient_id),
    INDEX idx_is_read (is_read),
    INDEX idx_notification_type (notification_type),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- AI MODEL VERSIONS TABLE
-- =====================================================
CREATE TABLE ai_model_versions (
    id BIGSERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    
    -- Model Details
    description TEXT NULL,
    training_date DATE NULL,
    accuracy_percentage DECIMAL(5,2) NULL,
    
    -- Configuration
    model_config JSON NOT NULL,
    thresholds JSON NOT NULL, -- Pass/fail thresholds
    
    -- Status
    is_active BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMP NULL,
    deployed_by BIGINT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (deployed_by) REFERENCES admin_users(id),
    UNIQUE KEY unique_active_model (model_name, is_active),
    INDEX idx_model_name (model_name),
    INDEX idx_is_active (is_active)
);

-- =====================================================
-- REPORTS TABLE (Pre-generated reports)
-- =====================================================
CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    report_name VARCHAR(255) NOT NULL,
    report_type ENUM('daily', 'weekly', 'monthly', 'custom') NOT NULL,
    
    -- Report Period
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Report Data
    report_data JSON NOT NULL, -- Complete report data
    summary JSON NULL, -- Key metrics summary
    
    -- Generation Info
    generated_by BIGINT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generation_time_seconds INT NULL,
    
    -- Access
    is_public BOOLEAN DEFAULT FALSE,
    access_level ENUM('public', 'admin_only', 'specific_roles') DEFAULT 'admin_only',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (generated_by) REFERENCES admin_users(id),
    INDEX idx_report_type (report_type),
    INDEX idx_start_date (start_date),
    INDEX idx_generated_at (generated_at)
);

-- =====================================================
-- INITIAL DATA INSERTS
-- =====================================================

-- Insert default admin user
INSERT INTO admin_users (employee_id, full_name, email, phone, role, permissions, department, designation, password_hash) VALUES
('PTP-ADM-001', 'System Administrator', 'admin@trafficpolice.punjab.gov.pk', '+92-300-0000000', 'super_admin', 
'["all"]', 'IT Department', 'System Administrator', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description, modified_by) VALUES
('system_name', 'Punjab Traffic Police - AI Driving Test System', 'string', 'general', 'System display name', 1),
('max_test_attempts_per_user', '1', 'number', 'test_rules', 'Maximum test attempts allowed per user without approval', 1),
('test_passing_score', '70', 'number', 'test_rules', 'Minimum score required to pass the test', 1),
('ai_confidence_threshold', '0.85', 'number', 'ai_config', 'Minimum AI confidence level for automated decisions', 1),
('test_session_timeout_minutes', '60', 'number', 'test_rules', 'Maximum duration for a test session', 1),
('enable_sms_notifications', 'true', 'boolean', 'notifications', 'Enable SMS notifications to users', 1),
('enable_email_notifications', 'true', 'boolean', 'notifications', 'Enable email notifications to users', 1);

-- Insert sample AI model version
INSERT INTO ai_model_versions (model_name, version, description, accuracy_percentage, model_config, thresholds, is_active, deployed_by) VALUES
('DrivingTestAI', 'v1.0.0', 'Initial AI model for driving test evaluation', 87.5, 
'{"framework": "TensorFlow", "architecture": "CNN-LSTM", "input_size": [224, 224, 3]}',
'{"pass_threshold": 70, "speed_violation_threshold": 10, "safety_score_minimum": 80}',
true, 1);

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- Composite indexes for common queries
CREATE INDEX idx_user_tests_status ON driving_tests(user_id, status, scheduled_date);
CREATE INDEX idx_daily_test_stats ON driving_tests(scheduled_date, status, result);
CREATE INDEX idx_admin_activity ON system_logs(admin_id, created_at, log_type);
CREATE INDEX idx_user_notification_unread ON notifications(recipient_id, recipient_type, is_read, created_at);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Dashboard stats view
CREATE VIEW dashboard_stats AS
SELECT 
    DATE(CURRENT_DATE) as stats_date,
    COUNT(DISTINCT u.id) as total_users,
    COUNT(CASE WHEN dt.scheduled_date = CURRENT_DATE THEN dt.id END) as tests_today,
    COUNT(CASE WHEN dt.status = 'in_progress' THEN dt.id END) as tests_in_progress,
    COUNT(CASE WHEN dt.result = 'pass' AND dt.scheduled_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) THEN dt.id END) as weekly_passes,
    COUNT(CASE WHEN dt.result = 'fail' AND dt.scheduled_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) THEN dt.id END) as weekly_fails,
    COUNT(CASE WHEN rar.status = 'pending' THEN rar.id END) as pending_approvals,
    ROUND(
        (COUNT(CASE WHEN dt.result = 'pass' AND dt.scheduled_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) THEN dt.id END) * 100.0) / 
        NULLIF(COUNT(CASE WHEN dt.result IN ('pass', 'fail') AND dt.scheduled_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) THEN dt.id END), 0), 
        2
    ) as monthly_pass_rate
FROM users u
LEFT JOIN driving_tests dt ON u.id = dt.user_id
LEFT JOIN retest_approval_requests rar ON u.id = rar.user_id;

-- User test summary view
CREATE VIEW user_test_summary AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.cnic,
    u.email,
    u.phone,
    uth.total_tests_taken,
    uth.total_tests_passed,
    uth.total_tests_failed,
    uth.last_test_date,
    uth.last_test_result,
    uth.can_retake,
    uth.best_score,
    COUNT(CASE WHEN rar.status = 'pending' THEN rar.id END) as pending_retest_requests
FROM users u
LEFT JOIN user_test_history uth ON u.id = uth.user_id
LEFT JOIN retest_approval_requests rar ON u.id = rar.user_id
GROUP BY u.id, uth.total_tests_taken, uth.total_tests_passed, uth.total_tests_failed, 
         uth.last_test_date, uth.last_test_result, uth.can_retake, uth.best_score;

-- =====================================================
-- TRIGGERS FOR DATA CONSISTENCY
-- =====================================================

-- Update user test history when a test is completed
DELIMITER //
CREATE TRIGGER update_user_test_history_after_test
AFTER UPDATE ON driving_tests
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO user_test_history (user_id, total_tests_taken, total_tests_passed, total_tests_failed, last_test_date, last_test_result, best_score, average_score)
        VALUES (NEW.user_id, 1, 
               CASE WHEN NEW.result = 'pass' THEN 1 ELSE 0 END,
               CASE WHEN NEW.result = 'fail' THEN 1 ELSE 0 END,
               DATE(NEW.end_time), NEW.result, NEW.overall_score, NEW.overall_score)
        ON DUPLICATE KEY UPDATE
            total_tests_taken = total_tests_taken + 1,
            total_tests_passed = total_tests_passed + CASE WHEN NEW.result = 'pass' THEN 1 ELSE 0 END,
            total_tests_failed = total_tests_failed + CASE WHEN NEW.result = 'fail' THEN 1 ELSE 0 END,
            last_test_date = DATE(NEW.end_time),
            last_test_result = NEW.result,
            best_score = GREATEST(IFNULL(best_score, 0), IFNULL(NEW.overall_score, 0)),
            average_score = (IFNULL(average_score, 0) * (total_tests_taken - 1) + IFNULL(NEW.overall_score, 0)) / total_tests_taken,
            can_retake = CASE WHEN NEW.result = 'fail' THEN FALSE ELSE can_retake END;
    END IF;
END;//

-- Log important system events
CREATE TRIGGER log_test_completion
AFTER UPDATE ON driving_tests
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO system_logs (log_type, severity, user_id, test_id, action, description, metadata)
        VALUES ('test_event', 'medium', NEW.user_id, NEW.id, 'test_completed', 
                CONCAT('Test completed with result: ', NEW.result), 
                JSON_OBJECT('score', NEW.overall_score, 'duration', NEW.actual_duration_minutes));
    END IF;
END;//

DELIMITER ;

-- =====================================================
-- SAMPLE DATA FOR TESTING (Optional)
-- =====================================================

-- Sample users (for testing purposes)
INSERT INTO users (cnic, full_name, father_name, email, phone, address, date_of_birth, gender, license_category) VALUES
('12345-1234567-1', 'Muhammad Ahmed Ali', 'Muhammad Hassan Ali', 'ahmed.ali@email.com', '+92-300-1234567', 'House 123, Block A, Lahore', '1995-06-15', 'male', 'car'),
('54321-7654321-2', 'Fatima Khan', 'Abdul Rahman Khan', 'fatima.khan@email.com', '+92-301-2345678', 'House 456, Block B, Karachi', '1998-03-22', 'female', 'car'),
('11111-2222222-3', 'Ali Hassan', 'Muhammad Hassan', 'ali.hassan@email.com', '+92-302-3456789', 'House 789, Block C, Islamabad', '1992-12-10', 'male', 'motorcycle');

-- This completes the comprehensive database schema for the Punjab Traffic Police AI Driving Test System
-- All tables include proper relationships, indexes, and constraints for optimal performance and data integrity