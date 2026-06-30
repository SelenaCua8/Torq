<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class MonthlyReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $pdfContent;
    public $filename;

    public function __construct($data, $pdfContent, $filename)
    {
        $this->data       = $data;
        $this->pdfContent = $pdfContent;
        $this->filename   = $filename;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '📊 Reporte Mensual Torq — ' . $this->data['periodo'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'email.monthly_report',
            with: ['data' => $this->data],
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromData(fn () => $this->pdfContent, $this->filename)
                ->withMime('application/pdf'),
        ];
    }
}