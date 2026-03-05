import './AnnouncementBar.css'

interface AnnouncementBarProps {
    label: string
    message: string
    ctaText: string
    ctaLink: string
}

function AnnouncementBar({ label, message, ctaText, ctaLink }: AnnouncementBarProps) {

    return (
        <div className="announcement-bar" role="banner">
            <div className="announcement-bar__inner">
                <div className="announcement-bar__content">
                    <span className="announcement-bar__label">{label}</span>
                    <span className="announcement-bar__separator">—</span>
                    <span className="announcement-bar__message">{message}</span>
                </div>
                <a
                    href={ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="announcement-bar__cta"
                >
                    {ctaText}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="announcement-bar__cta-arrow">
                        <path d="M1 6H11M11 6L6.5 1.5M11 6L6.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

export default AnnouncementBar
