# Generated by Django 4.2.4 on 2023-12-26 07:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_interest_profile_post_interests'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='name',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='surname',
        ),
    ]
